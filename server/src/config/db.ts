import mongoose from 'mongoose'
import { env } from './env'
import { logger } from '../utils/logger'

const MAX_RETRIES = 5
const RETRY_DELAY_MS = 5000

export async function connectDB(attempt = 1): Promise<void> {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })

    logger.info('✅ MongoDB connected')

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB runtime error:', err)
    })

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected — reconnecting...')
      void connectDB()
    })
  } catch (err) {
    if (attempt < MAX_RETRIES) {
      logger.warn(`MongoDB connect failed (attempt ${attempt}/${MAX_RETRIES}). Retrying in ${RETRY_DELAY_MS / 1000}s...`)
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS))
      return connectDB(attempt + 1)
    }
    logger.error('❌ MongoDB connection failed after max retries:', err)
    process.exit(1)
  }
}

export async function disconnectDB(): Promise<void> {
  await mongoose.connection.close()
  logger.info('MongoDB disconnected cleanly')
}