import cron from 'node-cron'
import { taskService } from '../services/task.service'
import { processTaskReminders } from '../services/notification/scheduler.service'
import { logger } from '../utils/logger'

const CHECK_WINDOW_MS = 10 * 60 * 1000 // check 10-minute window ahead

export function startReminderJob(): void {
  // Every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    try {
      const tasks = await taskService.getPendingReminderTasks(CHECK_WINDOW_MS)
      if (tasks.length > 0) {
        logger.info(`Reminder job: checking ${tasks.length} task(s)`)
        await processTaskReminders(tasks)
      }
    } catch (err) {
      logger.error('reminderJob error:', err)
    }
  })

  logger.info('✅ Reminder cron job started (every 5 minutes)')
}