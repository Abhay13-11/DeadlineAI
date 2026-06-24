export const APP_NAME = 'DeadlineAI'
export const APP_DESCRIPTION = 'Your AI-powered second brain for deadlines and tasks.'

export const ROUTES = {
  LOGIN:      '/login',
  CALLBACK:   '/auth/callback',
  DASHBOARD:  '/dashboard',
  TASKS:      '/tasks',
  CALENDAR:   '/calendar',
  KANBAN:     '/kanban',
  AI:         '/ai',
  ANALYTICS:  '/analytics',
  SETTINGS:   '/settings',
} as const

export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const

export const TOAST_DURATION = {
  SUCCESS: 3000,
  ERROR: 4000,
  INFO: 3000,
} as const

export const DEBOUNCE_MS = 400

export const REMINDER_LABELS: Record<string, string> = {
  '1w':    '1 week before',
  '3d':    '3 days before',
  '1d':    '1 day before',
  '6h':    '6 hours before',
  '1h':    '1 hour before',
  '30m':   '30 minutes before',
  '5m':    '5 minutes before',
  custom:  'Custom time',
}

export const CATEGORY_LABELS: Record<string, string> = {
  CodingContest:  'Coding Contest',
  JobApplication: 'Job Application',
  InProgress:     'In Progress',
}

export const GOOGLE_AUTH_URL = `${
  import.meta.env.VITE_API_URL?.replace('/api/v1', '') ?? 'http://localhost:5000'
}/api/v1/auth/google`