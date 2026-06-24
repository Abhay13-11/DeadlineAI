import { Response } from 'express'
import { PaginationMeta } from '../types'

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200,
  meta?: PaginationMeta
): void {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(meta && { meta }),
    timestamp: new Date().toISOString(),
  })
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 500,
  data?: unknown
): void {
  res.status(statusCode).json({
    success: false,
    message,
    ...(data !== undefined && { data }),
    timestamp: new Date().toISOString(),
  })
}