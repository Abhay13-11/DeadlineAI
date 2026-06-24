import webpush from 'web-push'
import { env } from '../../config/env'
import { logger } from '../../utils/logger'
import { WebPushSubscription } from '../../types'

let initialized = false

export function initWebPush(): void {
  if (!env.VAPID_PUBLIC_KEY || !env.VAPID_PRIVATE_KEY || !env.VAPID_EMAIL) {
    logger.warn('VAPID keys not set — web push disabled')
    return
  }

  webpush.setVapidDetails(
    env.VAPID_EMAIL,
    env.VAPID_PUBLIC_KEY,
    env.VAPID_PRIVATE_KEY
  )
  initialized = true
  logger.info('✅ Web Push (VAPID) initialized')
}

export async function sendWebPushNotification(
  subscription: WebPushSubscription,
  title: string,
  body: string,
  data?: Record<string, unknown>
): Promise<boolean> {
  if (!initialized) {
    logger.warn('Web push not initialized — skipping')
    return false
  }

  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({ title, body, data })
    )
    return true
  } catch (err) {
    logger.error('Web push send error:', err)
    return false
  }
}