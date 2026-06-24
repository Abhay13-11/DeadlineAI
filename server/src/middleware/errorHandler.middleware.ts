import { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/AppError'
import { logger } from '../utils/logger'
import { env } from '../config/env'

interface MongoError extends Error {
  code?: number
  keyValue?: Record<string, unknown>
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error({
    message: err.message,
    url: req.originalUrl,
    method: req.method,
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  })

  // Mongoose duplicate key
  if ((err as MongoError).code === 11000) {
    const field = Object.keys((err as MongoError).keyValue ?? {})[0] ?? 'field'
    res.status(409).json({
      success: false,
      message: `${field} already exists`,
      timestamp: new Date().toISOString(),
    })
    return
  }

  // Mongoose cast error (bad ObjectId)
  if (err.name === 'CastError') {
    res.status(400).json({
      success: false,
      message: 'Invalid ID format',
      timestamp: new Date().toISOString(),
    })
    return
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      message: 'Invalid token. Please log in again.',
      timestamp: new Date().toISOString(),
    })
    return
  }

  if (err.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      message: 'Token expired. Please log in again.',
      timestamp: new Date().toISOString(),
    })
    return
  }

  // Known operational errors
  if (err instanceof AppError && err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      timestamp: new Date().toISOString(),
    })
    return
  }

  // Unknown / programmer errors
  res.status(500).json({
    success: false,
    message: env.NODE_ENV === 'production' ? 'Something went wrong.' : err.message,
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
    timestamp: new Date().toISOString(),
  })
}