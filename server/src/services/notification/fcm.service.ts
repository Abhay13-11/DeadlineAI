import { logger } from '../../utils/logger'

let messaging: import('firebase-admin/messaging').Messaging | null = null

export async function initFCM(): Promise<void> {
  try {
    const { env } = await import('../../config/env')
    if (!env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      logger.warn('FIREBASE_SERVICE_ACCOUNT_KEY not set — FCM disabled')
      return
    }

    const admin = await import('firebase-admin')
    if (!admin.default.apps.length) {
      const serviceAccount = JSON.parse(
        Buffer.from(env.FIREBASE_SERVICE_ACCOUNT_KEY, 'base64').toString('utf-8')
      ) as import('firebase-admin').ServiceAccount

      admin.default.initializeApp({
        credential: admin.default.credential.cert(serviceAccount),
      })
    }

    messaging = admin.default.messaging()
    logger.info('✅ Firebase Admin (FCM) initialized')
  } catch (err) {
    logger.error('Failed to initialize FCM:', err)
  }
}

export async function sendFCMNotification(
  token: string,
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<boolean> {
  if (!messaging) {
    logger.warn('FCM not initialized — skipping push notification')
    return false
  }

  try {
    await messaging.send({
      token,
      notification: { title, body },
      data: data ?? {},
      android: { priority: 'high' },
      apns: { payload: { aps: { sound: 'default', badge: 1 } } },
    })
    return true
  } catch (err) {
    logger.error('FCM send error:', err)
    return false
  }
}