import { Request, Response, NextFunction } from 'express'
import { ZodSchema, ZodError } from 'zod'
import { sendError } from '../utils/apiResponse'

type Target = 'body' | 'query' | 'params'

export function validate(schema: ZodSchema, target: Target = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target])
    if (!result.success) {
      const errors = (result.error as ZodError).errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }))
      sendError(res, 'Validation failed', 400, errors)
      return
    }
    // Replace with parsed + coerced data
    req[target] = result.data as Record<string, unknown>
    next()
  }
}