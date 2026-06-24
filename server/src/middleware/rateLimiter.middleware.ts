import rateLimit from 'express-rate-limit'
import { sendError } from '../utils/apiResponse'

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) =>
    sendError(res, 'Too many requests. Please try again in 15 minutes.', 429),
})

export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) =>
    sendError(res, 'Too many auth attempts. Please try again in 1 hour.', 429),
})

export const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) =>
    sendError(res, 'AI rate limit reached. Please wait a moment.', 429),
})