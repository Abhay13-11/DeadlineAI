import { Task } from '../models/Task.model'
import { ActivityLog } from '../models/ActivityLog.model'
import { User } from '../models/User.model'
import {
  compareTasksByPriority,
  getReminderDeadlineCeiling,
  taskService,
} from './task.service'

jest.mock('../models/Task.model', () => ({
  Task: {
    create: jest.fn(),
  },
}))

jest.mock('../models/ActivityLog.model', () => ({
  ActivityLog: {
    create: jest.fn(),
  },
}))

jest.mock('../models/User.model', () => ({
  User: {
    findByIdAndUpdate: jest.fn(),
  },
}))

describe('TaskService.create', () => {
  it('creates one task, one activity record, and one user stats update', async () => {
    const userId = '665f1ad7c728df3ac31d1234'
    const createdTask = {
      _id: '665f1ad7c728df3ac31d5678',
      title: 'Minimal task',
      category: 'Others',
    }

    jest.mocked(Task.create).mockResolvedValue(createdTask as never)
    jest.mocked(User.findByIdAndUpdate).mockResolvedValue(null)
    jest.mocked(ActivityLog.create).mockResolvedValue({} as never)

    const result = await taskService.create(userId, {
      title: 'Minimal task',
      category: 'Others',
      priority: 'Medium',
      status: 'Pending',
      requiredDocuments: [],
      reminders: [],
      recurring: { enabled: false, interval: 1 },
      source: 'manual',
    })

    expect(result).toBe(createdTask)
    expect(Task.create).toHaveBeenCalledTimes(1)
    expect(User.findByIdAndUpdate).toHaveBeenCalledTimes(1)
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(userId, {
      $inc: { 'stats.totalTasks': 1 },
      'stats.lastActive': expect.any(Date),
    })
    expect(ActivityLog.create).toHaveBeenCalledTimes(1)
    expect(ActivityLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'task_created',
        metadata: { title: 'Minimal task', category: 'Others' },
      })
    )
  })
})

describe('task sorting helpers', () => {
  it('sorts priority ascending from low to critical', () => {
    const tasks = [
      { priority: 'Critical' },
      { priority: 'Low' },
      { priority: 'High' },
      { priority: 'Medium' },
    ] as const

    expect([...tasks].sort((a, b) => compareTasksByPriority(a, b, 'asc'))).toEqual([
      { priority: 'Low' },
      { priority: 'Medium' },
      { priority: 'High' },
      { priority: 'Critical' },
    ])
  })

  it('sorts priority descending from critical to low', () => {
    const tasks = [
      { priority: 'Low' },
      { priority: 'Critical' },
      { priority: 'Medium' },
      { priority: 'High' },
    ] as const

    expect([...tasks].sort((a, b) => compareTasksByPriority(a, b, 'desc'))).toEqual([
      { priority: 'Critical' },
      { priority: 'High' },
      { priority: 'Medium' },
      { priority: 'Low' },
    ])
  })
})

describe('reminder query helpers', () => {
  it('looks far enough ahead to include one-week reminders', () => {
    const now = new Date('2026-06-26T12:00:00.000Z')
    const tenMinutes = 10 * 60 * 1000

    expect(getReminderDeadlineCeiling(now, tenMinutes).toISOString()).toBe(
      '2026-07-03T12:10:00.000Z'
    )
  })
})