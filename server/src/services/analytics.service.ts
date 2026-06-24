import { Types } from 'mongoose'
import {
  startOfWeek, endOfWeek, startOfMonth, endOfMonth,
  subWeeks, subMonths, eachDayOfInterval, format,
} from 'date-fns'
import { Task } from '../models/Task.model'

interface StatusCount { _id: string; count: number }
interface CategoryCount { _id: string; count: number; completed: number }

export class AnalyticsService {
  async getOverview(userId: string) {
    const uid = new Types.ObjectId(userId)

    const [statusBreakdown, categoryBreakdown, priorityBreakdown, completionTrend] =
      await Promise.all([
        Task.aggregate<StatusCount>([
          { $match: { userId: uid, isArchived: false } },
          { $group: { _id: '$status', count: { $sum: 1 } } },
        ]),

        Task.aggregate<CategoryCount>([
          { $match: { userId: uid, isArchived: false } },
          {
            $group: {
              _id: '$category',
              count: { $sum: 1 },
              completed: {
                $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] },
              },
            },
          },
          { $sort: { count: -1 } },
        ]),

        Task.aggregate<StatusCount>([
          { $match: { userId: uid, isArchived: false } },
          { $group: { _id: '$priority', count: { $sum: 1 } } },
        ]),

        Task.aggregate<{ _id: string; count: number }>([
          {
            $match: {
              userId: uid,
              completedAt: { $gte: subWeeks(new Date(), 4) },
            },
          },
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m-%d', date: '$completedAt' } },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]),
      ])

    const sm = this.buildStatusMap(statusBreakdown)
    const total = Object.values(sm).reduce((s, c) => s + c, 0)
    const completed = sm['Completed'] ?? 0
    const missed = sm['Missed'] ?? 0

    return {
      summary: {
        total,
        completed,
        missed,
        pending: sm['Pending'] ?? 0,
        inProgress: sm['InProgress'] ?? 0,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
        missedRate: total > 0 ? Math.round((missed / total) * 100) : 0,
      },
      categoryBreakdown,
      priorityBreakdown,
      statusBreakdown,
      completionTrend,
    }
  }

  async getWeeklyReport(userId: string) {
    const uid = new Types.ObjectId(userId)
    const now = new Date()
    const thisStart = startOfWeek(now)
    const thisEnd = endOfWeek(now)
    const lastStart = startOfWeek(subWeeks(now, 1))
    const lastEnd = endOfWeek(subWeeks(now, 1))

    const [thisWeekRaw, lastWeekRaw, dailyRaw] = await Promise.all([
      Task.aggregate<StatusCount>([
        { $match: { userId: uid, createdAt: { $gte: thisStart, $lte: thisEnd } } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Task.aggregate<StatusCount>([
        { $match: { userId: uid, createdAt: { $gte: lastStart, $lte: lastEnd } } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Task.aggregate<{ _id: number; total: number; completed: number }>([
        { $match: { userId: uid, deadline: { $gte: thisStart, $lte: thisEnd } } },
        {
          $group: {
            _id: { $dayOfWeek: '$deadline' },
            total: { $sum: 1 },
            completed: { $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] } },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ])

    const days = eachDayOfInterval({ start: thisStart, end: thisEnd })
    const dailyBreakdown = days.map((d, i) => {
      const entry = dailyRaw.find((r) => r._id === i + 1)
      return {
        day: format(d, 'EEE'),
        date: format(d, 'MMM d'),
        total: entry?.total ?? 0,
        completed: entry?.completed ?? 0,
      }
    })

    return {
      thisWeek: this.buildSummary(thisWeekRaw),
      lastWeek: this.buildSummary(lastWeekRaw),
      dailyBreakdown,
    }
  }

  async getMonthlyReport(userId: string) {
    const uid = new Types.ObjectId(userId)
    const now = new Date()

    const months = await Promise.all(
      Array.from({ length: 6 }, (_, i) => {
        const ref = subMonths(now, i)
        return Task.aggregate<StatusCount>([
          {
            $match: {
              userId: uid,
              createdAt: { $gte: startOfMonth(ref), $lte: endOfMonth(ref) },
            },
          },
          { $group: { _id: '$status', count: { $sum: 1 } } },
        ]).then((raw) => ({
          month: format(ref, 'MMM yyyy'),
          ...this.buildSummary(raw),
        }))
      })
    )

    return { monthlyBreakdown: months.reverse() }
  }

  private buildStatusMap(data: StatusCount[]): Record<string, number> {
    return data.reduce((acc, { _id, count }) => ({ ...acc, [_id]: count }), {})
  }

  private buildSummary(data: StatusCount[]) {
    const sm = this.buildStatusMap(data)
    const total = Object.values(sm).reduce((s, c) => s + c, 0)
    const completed = sm['Completed'] ?? 0
    return {
      total,
      completed,
      missed: sm['Missed'] ?? 0,
      pending: sm['Pending'] ?? 0,
      inProgress: sm['InProgress'] ?? 0,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    }
  }
}

export const analyticsService = new AnalyticsService()