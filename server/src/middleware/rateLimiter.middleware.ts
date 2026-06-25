import rateLimit, { Options } from 'express-rate-limit'
import { Request, Response } from 'express'
import { sendError } from '../utils/apiResponse'
import { env } from '../config/env'

// Skip rate limiting entirely for OPTIONS preflight requests.
// Every browser POST/PUT/DELETE is preceded by an OPTIONS preflight.
// Without this, each real request costs 2 hits instead of 1.
const skipOptions = (req: Request): boolean => req.method === 'OPTIONS'

// In development, use a much higher limit so normal testing never hits it.
// In production, use conservative limits.
const isDev = env.NODE_ENV === 'development'

const baseOptions: Partial<Options> = {
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipOptions,
  // Use a consistent key: strip IPv6-mapped IPv4 prefix so
  // ::ffff:127.0.0.1 and 127.0.0.1 are treated as the same client.
  keyGenerator: (req: Request): string => {
    const ip = req.ip ?? req.socket.remoteAddress ?? 'unknown'
    return ip.replace('::ffff:', '')
  },
}

export const apiLimiter = rateLimit({
  ...baseOptions,
  windowMs: 15 * 60 * 1000,
  max: isDev ? 10000 : 300,
  handler: (_req: Request, res: Response) =>
    sendError(res, 'Too many requests. Please try again in 15 minutes.', 429),
})

export const authLimiter = rateLimit({
  ...baseOptions,
  windowMs: 60 * 60 * 1000,
  max: isDev ? 1000 : 20,
  handler: (_req: Request, res: Response) =>
    sendError(res, 'Too many auth attempts. Please try again in 1 hour.', 429),
})

export const aiLimiter = rateLimit({
  ...baseOptions,
  windowMs: 60 * 1000,
  max: isDev ? 500 : 20,
  handler: (_req: Request, res: Response) =>
    sendError(res, 'AI rate limit reached. Please wait a moment.', 429),
})