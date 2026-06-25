import { Task } from '../models/Task.model'
import { ActivityLog } from '../models/ActivityLog.model'
import { User } from '../models/User.model'
import { taskService } from './task.service'

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
