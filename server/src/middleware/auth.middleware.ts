import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../utils/jwt'
import { User } from '../models/User.model'
import { createUnauthorizedError } from '../utils/AppError'
import { asyncHandler } from '../utils/asyncHandler'

export const authenticate = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    let token: string | undefined

    const authHeader = req.headers.authorization
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1]
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken as string
    }

    if (!token) throw createUnauthorizedError('No authentication token provided.')

    const decoded = verifyAccessToken(token)

    const user = await User.findById(decoded.userId)
    if (!user) throw createUnauthorizedError('User no longer exists.')

    req.user = user
    next()
  }
)