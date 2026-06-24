import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import compression from 'compression'

import { env } from './config/env'
import './config/passport' // registers Google strategy

import { apiLimiter } from './middleware/rateLimiter.middleware'
import { errorHandler } from './middleware/errorHandler.middleware'

import { authRoutes } from './routes/auth.routes'
import { taskRoutes } from './routes/task.routes'
import { analyticsRoutes } from './routes/analytics.routes'

import { logger } from './utils/logger'

const app = express()

// ── Security ──────────────────────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: env.NODE_ENV === 'production' ? undefined : false,
  })
)

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

// ── Parsing & compression ─────────────────────────────────────────────────────
app.use(compression())
app.use(cookieParser())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// ── HTTP logging ──────────────────────────────────────────────────────────────
if (env.NODE_ENV !== 'test') {
  app.use(
    morgan('combined', {
      stream: { write: (msg) => logger.info(msg.trim()) },
    })
  )
}

// ── Rate limiting ─────────────────────────────────────────────────────────────
app.use('/api', apiLimiter)

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'healthy',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
  })
})

// ── API routes ────────────────────────────────────────────────────────────────
const V1 = '/api/v1'

app.use(`${V1}/auth`, authRoutes)
app.use(`${V1}/tasks`, taskRoutes)
app.use(`${V1}/analytics`, analyticsRoutes)

// AI routes placeholder — implemented in Milestone 3
app.use(`${V1}/ai`, (_req, res) => {
  res.status(501).json({ success: false, message: 'AI routes coming in Milestone 3' })
})

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    timestamp: new Date().toISOString(),
  })
})

// ── Global error handler ──────────────────────────────────────────────────────
app.use(errorHandler)

export { app }