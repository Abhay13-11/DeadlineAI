import { Router } from 'express'
import passport from 'passport'
import { asyncHandler } from '../utils/asyncHandler'
import { authenticate } from '../middleware/auth.middleware'
import { authLimiter } from '../middleware/rateLimiter.middleware'
import {
  googleCallback, refreshToken, logout, getMe,
  updatePreferences, updateFCMToken, updateWebPushSubscription,
} from '../controllers/auth.controller'

const router = Router()

router.get(
  '/google',
  authLimiter,
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
)

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL}/login?error=auth_failed`,
    session: false,
  }),
  googleCallback
)

router.post('/refresh', asyncHandler(refreshToken))
router.post('/logout', logout)
router.get('/me', authenticate, asyncHandler(getMe))
router.put('/preferences', authenticate, asyncHandler(updatePreferences))
router.post('/fcm-token', authenticate, asyncHandler(updateFCMToken))
router.post('/web-push-subscription', authenticate, asyncHandler(updateWebPushSubscription))

export { router as authRoutes }