import mongoose from 'mongoose'
import { env } from './env'
import { logger } from '../utils/logger'

const MAX_RETRIES = 5
const RETRY_DELAY_MS = 5000

export async function connectDB(attempt = 1): Promise<void> {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      heartbeatFrequencyMS: 10000,
      retryWrites: true,
      retryReads: true,
    })

    logger.info('MongoDB connected')

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB runtime error:', err)
    })

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected')
    })

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected')
    })
  } catch (err) {
    logger.error('MongoDB connection error:', err)

    if (attempt < MAX_RETRIES) {
      logger.warn(`MongoDB connect attempt ${attempt}/${MAX_RETRIES} failed. Retrying in 5s...`)
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS))
      return connectDB(attempt + 1)
    }

    throw err
  }
}

export async function disconnectDB(): Promise<void> {
  await mongoose.connection.close()
  logger.info('MongoDB disconnected cleanly')
}