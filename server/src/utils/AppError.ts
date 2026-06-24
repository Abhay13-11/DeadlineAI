export class AppError extends Error {
  public readonly statusCode: number
  public readonly isOperational: boolean

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational
    Object.setPrototypeOf(this, new.target.prototype)
    Error.captureStackTrace(this, this.constructor)
  }
}

export const createNotFoundError = (resource = 'Resource') =>
  new AppError(`${resource} not found`, 404)

export const createUnauthorizedError = (msg = 'Unauthorized. Please log in.') =>
  new AppError(msg, 401)

export const createForbiddenError = (msg = 'You do not have permission to perform this action.') =>
  new AppError(msg, 403)

export const createValidationError = (msg: string) =>
  new AppError(msg, 400)

export const createConflictError = (msg: string) =>
  new AppError(msg, 409)