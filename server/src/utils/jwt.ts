import jwt, { SignOptions } from 'jsonwebtoken'
import { env } from '../config/env'
import { JWTPayload } from '../types'

export function generateAccessToken(payload: JWTPayload): string {
  const options: SignOptions = { expiresIn: '7d' }
  return jwt.sign(
    { userId: payload.userId, email: payload.email },
    env.JWT_SECRET,
    options
  )
}

export function generateRefreshToken(payload: JWTPayload): string {
  const options: SignOptions = { expiresIn: '30d' }
  return jwt.sign(
    { userId: payload.userId, email: payload.email },
    env.JWT_REFRESH_SECRET,
    options
  )
}

export function verifyAccessToken(token: string): JWTPayload {
  return jwt.verify(token, env.JWT_SECRET) as JWTPayload
}

export function verifyRefreshToken(token: string): JWTPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as JWTPayload
}