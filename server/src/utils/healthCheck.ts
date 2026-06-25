import mongoose from 'mongoose'
import { isGeminiConfigured } from '../services/ai/geminiClient.service'

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  uptime: number
  environment: string
  services: {
    database: 'connected' | 'disconnected' | 'connecting'
    ai: 'configured' | 'not_configured'
    fcm: 'configured' | 'not_configured'
    webPush: 'configured' | 'not_configured'
  }
  version: string
}

export function getHealthStatus(env: Record<string, string | undefined>): HealthStatus {
  const dbState = mongoose.connection.readyState
  const dbStatus =
    dbState === 1 ? 'connected'
    : dbState === 2 ? 'connecting'
    : 'disconnected'

  const services = {
    database: dbStatus,
    ai: isGeminiConfigured(env.GEMINI_API_KEY) ? 'configured' : 'not_configured',
    fcm: env.FIREBASE_SERVICE_ACCOUNT_KEY ? 'configured' : 'not_configured',
    webPush: env.VAPID_PUBLIC_KEY ? 'configured' : 'not_configured',
  } as HealthStatus['services']

  const allHealthy = dbStatus === 'connected'
  const anyDown = dbStatus === 'disconnected'

  return {
    status: allHealthy ? 'healthy' : anyDown ? 'degraded' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    environment: env.NODE_ENV ?? 'development',
    services,
    version: '1.0.0',
  }
}
