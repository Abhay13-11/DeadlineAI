import { useEffect, useCallback } from 'react'
import { useAuthStore } from '../store/authStore'
import { authService } from '../services/authService'

export function useNotifications() {
  const { isAuthenticated } = useAuthStore()

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!('Notification' in window)) return false
    if (Notification.permission === 'granted') return true
    if (Notification.permission === 'denied') return false

    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }, [])

  const subscribeWebPush = useCallback(async () => {
    if (!isAuthenticated) return
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return

    try {
      const granted = await requestPermission()
      if (!granted) return

      const registration = await navigator.serviceWorker.ready
      const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY as string
      if (!vapidKey) return

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey) as BufferSource,
      })

      await authService.updateWebPushSubscription(subscription.toJSON() as PushSubscriptionJSON)
    } catch {
      // Push subscription is optional — fail silently
    }
  }, [isAuthenticated, requestPermission])

  useEffect(() => {
    if (isAuthenticated) {
      void subscribeWebPush()
    }
  }, [isAuthenticated, subscribeWebPush])

  return { requestPermission, subscribeWebPush }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)))
}