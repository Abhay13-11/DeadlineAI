import { api } from './api'
import { IUser, ApiResponse } from '../types'

export const authService = {
  getMe(): Promise<ApiResponse<IUser>> {
    return api.get<ApiResponse<IUser>>('/auth/me').then((r) => r.data)
  },

  logout(): Promise<void> {
    return api.post('/auth/logout').then(() => undefined)
  },

  updateFCMToken(token: string): Promise<void> {
    return api.post('/auth/fcm-token', { token }).then(() => undefined)
  },

  updateWebPushSubscription(subscription: PushSubscriptionJSON): Promise<void> {
    return api.post('/auth/web-push-subscription', { subscription }).then(() => undefined)
  },

  refreshToken(): Promise<{ accessToken: string }> {
    return api.post<ApiResponse<{ accessToken: string }>>('/auth/refresh').then((r) => r.data.data)
  },
}