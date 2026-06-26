import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import compression from 'compression'

import { env } from './config/env'
import './config/passport'

import { apiLimiter } from './middleware/rateLimiter.middleware'
import { errorHandler } from './middleware/errorHandler.middleware'

import { authRoutes } from './routes/auth.routes'
import { taskRoutes } from './routes/task.routes'
import { analyticsRoutes } from './routes/analytics.routes'
import { aiRoutes } from './routes/ai.routes'

import { logger } from './utils/logger'
import { getHealthStatus } from './utils/healthCheck'

const app = express()
const DEV_CLIENT_ORIGINS = [
  env.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]
const allowedOrigins =
  env.NODE_ENV === 'production' ? [env.CLIENT_URL] : Array.from(new Set(DEV_CLIENT_ORIGINS))

// Required for express-rate-limit to correctly identify client IPs.
// Without this, req.ip is undefined or ::ffff:127.0.0.1 in some environments,
// causing all clients to share one rate limit bucket.
app.set('trust proxy', 1)

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: env.NODE_ENV === 'production' ? undefined : false,
  })
)

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
        return
      }

      callback(new Error(`Origin ${origin} is not allowed by CORS`))
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

app.use(compression())
app.use(cookieParser())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

if (env.NODE_ENV !== 'test') {
  app.use(
    morgan('combined', {
      stream: { write: (msg) => logger.info(msg.trim()) },
    })
  )
}

app.use('/api', apiLimiter)

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  const health = getHealthStatus(env as unknown as Record<string, string>)
  const statusCode = health.status === 'healthy' ? 200 : 207
  res.status(statusCode).json(health)
})

// ── API routes ────────────────────────────────────────────────────────────────
const V1 = '/api/v1'

app.use(`${V1}/auth`, authRoutes)
app.use(`${V1}/tasks`, taskRoutes)
app.use(`${V1}/analytics`, analyticsRoutes)
app.use(`${V1}/ai`, aiRoutes)

// ── 404 ───────────────────────────────────────────────────────────────────────
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