import { Request, Response } from 'express'
import { IUser } from '../models/User.model'
import { User } from '../models/User.model'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt'
import { sendSuccess, sendError } from '../utils/apiResponse'
import { createUnauthorizedError } from '../utils/AppError'
import { env } from '../config/env'

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: env.NODE_ENV === 'production' ? 'none' as const : 'lax' as const,
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
}

const CLEAR_REFRESH_COOKIE_OPTIONS = {
  httpOnly: REFRESH_COOKIE_OPTIONS.httpOnly,
  secure: REFRESH_COOKIE_OPTIONS.secure,
  sameSite: REFRESH_COOKIE_OPTIONS.sameSite,
}

function issueTokens(user: IUser) {
  const payload = { userId: user._id.toString(), email: user.email }
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  }
}

export function googleCallback(req: Request, res: Response): void {
  try {
    const user = req.user as IUser | undefined
    if (!user) {
      res.redirect(`${env.CLIENT_URL}/login?error=auth_failed`)
      return
    }

    const { accessToken, refreshToken } = issueTokens(user)
    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS)
    // Pass access token via URL; the SPA stores it in memory
    res.redirect(`${env.CLIENT_URL}/auth/callback?token=${accessToken}`)
  } catch {
    res.redirect(`${env.CLIENT_URL}/login?error=server_error`)
  }
}

export async function refreshToken(req: Request, res: Response): Promise<void> {
  const token = req.cookies?.refreshToken as string | undefined
  if (!token) {
    sendError(res, 'No refresh token', 401)
    return
  }

  const decoded = verifyRefreshToken(token)
  const user = await User.findById(decoded.userId)
  if (!user) throw createUnauthorizedError('User not found')

  const { accessToken, refreshToken: newRefresh } = issueTokens(user)
  res.cookie('refreshToken', newRefresh, REFRESH_COOKIE_OPTIONS)
  sendSuccess(res, { accessToken }, 'Token refreshed')
}

export function logout(_req: Request, res: Response): void {
  res.clearCookie('refreshToken', CLEAR_REFRESH_COOKIE_OPTIONS)
  sendSuccess(res, null, 'Logged out successfully')
}

export async function getMe(req: Request, res: Response): Promise<void> {
  const user = req.user as IUser
  sendSuccess(res, {
    _id: user._id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    preferences: user.preferences,
    stats: user.stats,
    createdAt: user.createdAt,
  })
}

export async function updatePreferences(req: Request, res: Response): Promise<void> {
  const user = req.user as IUser
  const { preferences } = req.body as { preferences: Partial<IUser['preferences']> }

  const updated = await User.findByIdAndUpdate(
    user._id,
    { $set: { preferences: { ...user.preferences, ...preferences } } },
    { new: true }
  ).select('preferences')

  sendSuccess(res, updated?.preferences, 'Preferences updated')
}

export async function updateFCMToken(req: Request, res: Response): Promise<void> {
  const user = req.user as IUser
  const { token } = req.body as { token: string }

  await User.findByIdAndUpdate(user._id, { fcmToken: token })
  sendSuccess(res, null, 'FCM token updated')
}

export async function updateWebPushSubscription(req: Request, res: Response): Promise<void> {
  const user = req.user as IUser
  const { subscription } = req.body as { subscription: unknown }

  await User.findByIdAndUpdate(user._id, { webPushSubscription: subscription })
  sendSuccess(res, null, 'Web push subscription saved')
}
