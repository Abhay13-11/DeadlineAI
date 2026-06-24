export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
] as const

export const SUPPORTED_UPLOAD_TYPES = [
  ...SUPPORTED_IMAGE_TYPES,
  'application/pdf',
] as const

export const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024 // 10MB

export const MAX_TASKS_PER_USER = 1000

export const MAX_ATTACHMENTS_PER_TASK = 5

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
} as const

export const CRON_SCHEDULES = {
  REMINDER_CHECK: '*/5 * * * *',     // every 5 minutes
  MISSED_TASK_CHECK: '*/30 * * * *', // every 30 minutes
} as const

export const JWT_CONFIG = {
  ACCESS_EXPIRY: '7d',
  REFRESH_EXPIRY: '30d',
  COOKIE_MAX_AGE: 30 * 24 * 60 * 60 * 1000,
} as const