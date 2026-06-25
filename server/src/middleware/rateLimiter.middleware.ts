import rateLimit, { Options } from 'express-rate-limit'
import { Request, Response } from 'express'
import { sendError } from '../utils/apiResponse'
import { env } from '../config/env'
import { verifyAccessToken } from '../utils/jwt'
import { logger } from '../utils/logger'

// Skip rate limiting entirely for OPTIONS preflight requests.
// Every browser POST/PUT/DELETE is preceded by an OPTIONS preflight.
// Without this, each real request costs 2 hits instead of 1.
const skipOptions = (req: Request): boolean => req.method === 'OPTIONS'

// Development remains rate-limited so request loops are visible during testing.
const isDev = env.NODE_ENV === 'development'

const getClientKey = (req: Request): string => {
  const authHeader = req.headers.authorization
  if (authHeader?.startsWith('Bearer ')) {
    try {
      const decoded = verifyAccessToken(authHeader.slice(7))
      return `user:${decoded.userId}`
    } catch {
      // Invalid/expired tokens fall back to IP and are handled by auth middleware.
    }
  }

  const ip = req.ip ?? req.socket.remoteAddress ?? 'unknown'
  return `ip:${ip.replace('::ffff:', '')}`
}

const rateLimitHandler = (message: string) =>
  (req: Request, res: Response): void => {
    logger.warn({
      message: 'Rate limit exceeded',
      limiterMessage: message,
      key: getClientKey(req),
      method: req.method,
      path: req.originalUrl,
    })
    sendError(res, message, 429)
  }

const baseOptions: Partial<Options> = {
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipOptions,
  keyGenerator: getClientKey,
}

export const apiLimiter = rateLimit({
  ...baseOptions,
  windowMs: 15 * 60 * 1000,
  max: isDev ? 600 : 300,
  handler: rateLimitHandler('Too many requests. Please try again in 15 minutes.'),
})

export const authLimiter = rateLimit({
  ...baseOptions,
  windowMs: 60 * 60 * 1000,
  max: isDev ? 100 : 20,
  handler: rateLimitHandler('Too many auth attempts. Please try again in 1 hour.'),
})

export const aiLimiter = rateLimit({
  ...baseOptions,
  windowMs: 60 * 1000,
  max: isDev ? 60 : 20,
  handler: rateLimitHandler('AI rate limit reached. Please wait a moment.'),
})
