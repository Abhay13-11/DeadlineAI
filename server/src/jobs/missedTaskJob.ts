import cron from 'node-cron'
import { Task } from '../models/Task.model'
import { ActivityLog } from '../models/ActivityLog.model'
import { User } from '../models/User.model'
import { logger } from '../utils/logger'
import { Types } from 'mongoose'

export function startMissedTaskJob(): void {
  // Every 30 minutes
  cron.schedule('*/30 * * * *', async () => {
    try {
      const overdue = await Task.find({
        isArchived: false,
        deadline: { $lt: new Date() },
        status: { $in: ['Pending', 'InProgress'] },
      }).select('_id userId title deadline')

      if (overdue.length === 0) return

      logger.info(`Marking ${overdue.length} overdue task(s) as Missed`)

      await Task.bulkWrite(
        overdue.map((t) => ({
          updateOne: {
            filter: { _id: t._id },
            update: {
              $set: { status: 'Missed' },
              $push: {
                timeline: {
                  _id: new Types.ObjectId(),
                  action: 'Auto-marked as Missed (deadline passed)',
                  at: new Date(),
                  by: 'system',
                },
              },
            },
          },
        }))
      )

      await ActivityLog.insertMany(
        overdue.map((t) => ({
          userId: t.userId,
          taskId: t._id,
          action: 'task_missed',
          metadata: { title: t.title, deadline: t.deadline },
          timestamp: new Date(),
        }))
      )

      // Group missed count by user
      const byUser = overdue.reduce(
        (acc: Record<string, number>, t) => {
          const uid = t.userId.toString()
          acc[uid] = (acc[uid] ?? 0) + 1
          return acc
        },
        {}
      )

      await Promise.all(
        Object.entries(byUser).map(([uid, count]) =>
          User.findByIdAndUpdate(uid, { $inc: { 'stats.missedTasks': count } })
        )
      )
    } catch (err) {
      logger.error('missedTaskJob error:', err)
    }
  })

  logger.info('✅ Missed-task cron job started (every 30 minutes)')
}