import { ITask } from '../../models/Task.model'
import { User } from '../../models/User.model'
import { ReminderLog } from '../../models/ReminderLog.model'
import { ActivityLog } from '../../models/ActivityLog.model'
import { sendFCMNotification } from './fcm.service'
import { sendWebPushNotification } from './webpush.service'
import { getReminderFireTime } from '../../utils/dateHelpers'
import { logger } from '../../utils/logger'
import { Types } from 'mongoose'

export async function processTaskReminders(tasks: ITask[]): Promise<void> {
  const now = new Date()

  for (const task of tasks) {
    if (!task.deadline) continue

    for (const reminder of task.reminders) {
      if (reminder.sent) continue

      const fireTime = getReminderFireTime(task.deadline, reminder.type, reminder.customTime)
      if (!fireTime) continue
      if (fireTime > now) continue

      // Fire this reminder
      const user = await User.findById(task.userId)
      if (!user) continue

      const title = `⏰ Reminder: ${task.title}`
      const body = buildReminderBody(task, reminder.type)
      let sent = false

      // Try FCM first
      if (user.fcmToken) {
        sent = await sendFCMNotification(user.fcmToken, title, body, {
          taskId: task._id.toString(),
          category: task.category,
        })
      }

      // Try web push if FCM didn't work or as supplement
      if (!sent && user.webPushSubscription) {
        sent = await sendWebPushNotification(user.webPushSubscription, title, body, {
          taskId: task._id.toString(),
        })
      }

      // Mark reminder as sent regardless so we don't retry infinitely
      reminder.sent = true
      reminder.sentAt = now
      await task.save()

      await Promise.all([
        ReminderLog.create({
          taskId: task._id,
          userId: task.userId,
          reminderType: reminder.type,
          scheduledFor: fireTime,
          sentAt: now,
          channel: user.fcmToken ? 'push' : 'web-push',
          status: sent ? 'sent' : 'failed',
        }),
        ActivityLog.create({
          userId: task.userId,
          taskId: task._id,
          action: 'reminder_sent',
          metadata: { reminderType: reminder.type, sent },
        }),
      ])

      logger.info(`Reminder [${reminder.type}] ${sent ? 'sent' : 'failed'} for task: ${task.title}`)
    }
  }
}

function buildReminderBody(task: ITask, type: string): string {
  const labels: Record<string, string> = {
    '1w': '1 week',
    '3d': '3 days',
    '1d': '1 day',
    '6h': '6 hours',
    '1h': '1 hour',
    '30m': '30 minutes',
    '5m': '5 minutes',
    custom: 'soon',
  }
  const label = labels[type] ?? 'soon'
  const deadline = task.deadline
    ? new Date(task.deadline).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: task.deadlineTime ? '2-digit' : undefined,
        minute: task.deadlineTime ? '2-digit' : undefined,
      })
    : 'upcoming'
  return `Due in ${label} — ${task.category} • ${deadline}`
}