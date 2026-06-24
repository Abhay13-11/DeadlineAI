import { app } from './app'
import { connectDB, disconnectDB } from './config/db'
import { env } from './config/env'
import { logger } from './utils/logger'
import { startReminderJob } from './jobs/reminderJob'
import { startMissedTaskJob } from './jobs/missedTaskJob'
import { initFCM } from './services/notification/fcm.service'
import { initWebPush } from './services/notification/webpush.service'

const PORT = parseInt(env.PORT, 10)

async function bootstrap(): Promise<void> {
  // 1. Database
  await connectDB()

  // 2. Notification services (non-blocking)
  await initFCM()
  initWebPush()

  // 3. HTTP server
  const server = app.listen(PORT, () => {
    logger.info(`🚀 DeadlineAI server running on port ${PORT} [${env.NODE_ENV}]`)
    logger.info(`   API: http://localhost:${PORT}/api/v1`)
    logger.info(`   Health: http://localhost:${PORT}/health`)
  })

  // 4. Background cron jobs
  startReminderJob()
  startMissedTaskJob()

  // 5. Graceful shutdown
  const shutdown = async (signal: string): Promise<void> => {
    logger.info(`${signal} received — shutting down gracefully...`)
    server.close(async () => {
      await disconnectDB()
      logger.info('Server closed cleanly.')
      process.exit(0)
    })
    setTimeout(() => {
      logger.error('Forced exit after 30s')
      process.exit(1)
    }, 30_000)
  }

  process.on('SIGTERM', () => void shutdown('SIGTERM'))
  process.on('SIGINT', () => void shutdown('SIGINT'))

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled rejection:', reason)
    void shutdown('unhandledRejection')
  })

  process.on('uncaughtException', (err) => {
    logger.error('Uncaught exception:', err)
    void shutdown('uncaughtException')
  })
}

bootstrap().catch((err) => {
  console.error('Bootstrap failed:', err)
  process.exit(1)
})