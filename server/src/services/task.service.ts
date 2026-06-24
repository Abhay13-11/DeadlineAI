import { Types, FilterQuery } from 'mongoose'
import {
  startOfDay, endOfDay, addDays,
  startOfWeek, endOfWeek, startOfMonth, endOfMonth,
} from 'date-fns'
import { Task, ITask } from '../models/Task.model'
import { ActivityLog } from '../models/ActivityLog.model'
import { User } from '../models/User.model'
import { CreateTaskInput, UpdateTaskInput, TaskQueryInput } from '../validators/task.validator'
import { createNotFoundError, createForbiddenError } from '../utils/AppError'
import { TaskStatus, DashboardStats } from '../types'

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  totalPages: number
}

export interface DashboardData {
  todayTasks: ITask[]
  upcomingTasks: ITask[]
  overdueTasks: ITask[]
  stats: DashboardStats
  recentActivity: unknown[]
}

// Priority sort order used for in-memory sort when needed
const PRIORITY_ORDER: Record<string, number> = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1,
}

export class TaskService {
  async getTasks(
    userId: string,
    query: TaskQueryInput
  ): Promise<PaginatedResult<ITask>> {
    const {
      page, limit, category, priority, status,
      search, sort, order, filter,
      deadline_from, deadline_to,
    } = query

    const now = new Date()
    const filter_query: FilterQuery<ITask> = {
      userId: new Types.ObjectId(userId),
      isArchived: false,
    }

    // Preset quick filters
    if (filter) {
      switch (filter) {
        case 'today':
          filter_query.deadline = { $gte: startOfDay(now), $lte: endOfDay(now) }
          break
        case 'tomorrow':
          filter_query.deadline = {
            $gte: startOfDay(addDays(now, 1)),
            $lte: endOfDay(addDays(now, 1)),
          }
          break
        case 'this_week':
          filter_query.deadline = { $gte: startOfWeek(now), $lte: endOfWeek(now) }
          break
        case 'this_month':
          filter_query.deadline = { $gte: startOfMonth(now), $lte: endOfMonth(now) }
          break
        case 'overdue':
          filter_query.deadline = { $lt: startOfDay(now) }
          filter_query.status = { $nin: ['Completed', 'Missed'] }
          break
        case 'high_priority':
          filter_query.priority = { $in: ['High', 'Critical'] }
          break
      }
    }

    if (category) filter_query.category = category
    if (priority) filter_query.priority = priority
    if (status) filter_query.status = status

    if (deadline_from || deadline_to) {
      filter_query.deadline = {
        ...(deadline_from ? { $gte: new Date(deadline_from) } : {}),
        ...(deadline_to ? { $lte: new Date(deadline_to) } : {}),
      }
    }

    if (search) {
      filter_query.$text = { $search: search }
    }

    const sortObj: Record<string, 1 | -1> =
      sort === 'priority'
        ? { deadline: order === 'asc' ? 1 : -1 } // fallback; priority sorted in memory
        : { [sort]: order === 'asc' ? 1 : -1 }

    const skip = (page - 1) * limit

    const [rawTasks, total] = await Promise.all([
      Task.find(filter_query).sort(sortObj).skip(skip).limit(limit).lean<ITask[]>(),
      Task.countDocuments(filter_query),
    ])

    // In-memory priority sort if requested
    const tasks =
      sort === 'priority'
        ? [...rawTasks].sort((a, b) => {
            const diff =
              (PRIORITY_ORDER[b.priority] ?? 0) - (PRIORITY_ORDER[a.priority] ?? 0)
            return order === 'desc' ? -diff : diff
          })
        : rawTasks

    return {
      items: tasks,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  async getDashboard(userId: string): Promise<DashboardData> {
    const now = new Date()
    const uid = new Types.ObjectId(userId)

    const [todayTasks, upcomingTasks, overdueTasks, statusAgg, recentActivity] =
      await Promise.all([
        Task.find({
          userId: uid,
          isArchived: false,
          deadline: { $gte: startOfDay(now), $lte: endOfDay(now) },
        })
          .sort({ priority: -1 })
          .limit(15)
          .lean<ITask[]>(),

        Task.find({
          userId: uid,
          isArchived: false,
          deadline: { $gt: endOfDay(now), $lte: endOfDay(addDays(now, 7)) },
          status: { $nin: ['Completed', 'Missed'] },
        })
          .sort({ deadline: 1 })
          .limit(10)
          .lean<ITask[]>(),

        Task.find({
          userId: uid,
          isArchived: false,
          deadline: { $lt: startOfDay(now) },
          status: { $nin: ['Completed', 'Missed'] },
        })
          .sort({ deadline: 1 })
          .limit(10)
          .lean<ITask[]>(),

        Task.aggregate<{ _id: string; count: number }>([
          { $match: { userId: uid, isArchived: false } },
          { $group: { _id: '$status', count: { $sum: 1 } } },
        ]),

        ActivityLog.find({ userId: uid })
          .sort({ timestamp: -1 })
          .limit(20)
          .populate('taskId', 'title category status')
          .lean(),
      ])

    const statusMap = statusAgg.reduce(
      (acc, item) => ({ ...acc, [item._id]: item.count }),
      {} as Record<string, number>
    )

    const total = Object.values(statusMap).reduce((s, c) => s + c, 0)
    const completed = statusMap['Completed'] ?? 0

    return {
      todayTasks,
      upcomingTasks,
      overdueTasks,
      recentActivity,
      stats: {
        total,
        completed,
        pending: statusMap['Pending'] ?? 0,
        inProgress: statusMap['InProgress'] ?? 0,
        missed: statusMap['Missed'] ?? 0,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      },
    }
  }

  async getById(userId: string, taskId: string): Promise<ITask> {
    const task = await Task.findById(taskId).lean<ITask>()
    if (!task) throw createNotFoundError('Task')
    if (task.userId.toString() !== userId) throw createForbiddenError()
    return task
  }

  async create(userId: string, input: CreateTaskInput): Promise<ITask> {
    const task = await Task.create({
      ...input,
      userId: new Types.ObjectId(userId),
      deadline: input.deadline ? new Date(input.deadline) : undefined,
      reminders: (input.reminders ?? []).map((r) => ({
        ...r,
        customTime: r.customTime ? new Date(r.customTime) : undefined,
      })),
      recurring: input.recurring
        ? {
            ...input.recurring,
            until: input.recurring.until ? new Date(input.recurring.until) : undefined,
          }
        : { enabled: false, interval: 1 },
      timeline: [{ action: 'Task created', at: new Date(), by: userId }],
    })

    await Promise.all([
      User.findByIdAndUpdate(userId, {
        $inc: { 'stats.totalTasks': 1 },
        'stats.lastActive': new Date(),
      }),
      ActivityLog.create({
        userId: new Types.ObjectId(userId),
        taskId: task._id,
        action: 'task_created',
        metadata: { title: task.title, category: task.category },
      }),
    ])

    return task
  }

  async update(userId: string, taskId: string, input: UpdateTaskInput): Promise<ITask> {
    const task = await Task.findById(taskId)
    if (!task) throw createNotFoundError('Task')
    if (task.userId.toString() !== userId) throw createForbiddenError()

    const prevStatus = task.status

    // Apply all provided fields
    Object.assign(task, {
      ...input,
      ...(input.deadline ? { deadline: new Date(input.deadline) } : {}),
    })

    task.timeline.push({
      _id: new Types.ObjectId(),
      action: `Task updated: ${Object.keys(input).join(', ')}`,
      at: new Date(),
      by: userId,
      metadata: { updatedFields: Object.keys(input) },
    })

    if (input.status === 'Completed' && prevStatus !== 'Completed') {
      task.completedAt = new Date()
    }

    await task.save()

    const isStatusChange = input.status !== undefined && input.status !== prevStatus

    await ActivityLog.create({
      userId: new Types.ObjectId(userId),
      taskId: task._id,
      action: isStatusChange ? 'status_changed' : 'task_updated',
      metadata: isStatusChange
        ? { from: prevStatus, to: input.status }
        : { updatedFields: Object.keys(input) },
    })

    if (input.status === 'Completed' && prevStatus !== 'Completed') {
      await User.findByIdAndUpdate(userId, { $inc: { 'stats.completedTasks': 1 } })
    }

    return task
  }

  async updateStatus(userId: string, taskId: string, status: TaskStatus): Promise<ITask> {
    return this.update(userId, taskId, { status })
  }

  async delete(userId: string, taskId: string): Promise<void> {
    const task = await Task.findById(taskId)
    if (!task) throw createNotFoundError('Task')
    if (task.userId.toString() !== userId) throw createForbiddenError()

    task.isArchived = true
    task.timeline.push({
      _id: new Types.ObjectId(),
      action: 'Task archived (deleted)',
      at: new Date(),
      by: userId,
    })
    await task.save()

    await ActivityLog.create({
      userId: new Types.ObjectId(userId),
      taskId: task._id,
      action: 'task_deleted',
      metadata: { title: task.title },
    })
  }

  /** Used by cron jobs */
  async getPendingReminderTasks(windowMs: number): Promise<ITask[]> {
    const now = new Date()
    const ceiling = new Date(now.getTime() + windowMs)
    return Task.find({
      isArchived: false,
      status: { $nin: ['Completed', 'Missed'] },
      deadline: { $gte: now, $lte: ceiling },
      'reminders.sent': false,
    }).populate('userId', 'fcmToken webPushSubscription email name')
  }

  async getOverduePending(): Promise<ITask[]> {
    return Task.find({
      isArchived: false,
      deadline: { $lt: new Date() },
      status: { $in: ['Pending', 'InProgress'] },
    })
  }
}

export const taskService = new TaskService()