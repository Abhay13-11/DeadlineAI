import { Types } from 'mongoose'

export type TaskCategory =
  | 'Internship'
  | 'Hackathon'
  | 'Assignment'
  | 'Meeting'
  | 'Interview'
  | 'CodingContest'
  | 'Certification'
  | 'Exam'
  | 'College'
  | 'Personal'
  | 'JobApplication'
  | 'Others'

export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical'
export type TaskStatus = 'Pending' | 'InProgress' | 'Completed' | 'Missed'
export type TaskSource = 'manual' | 'ai' | 'ocr' | 'voice' | 'email'
export type ReminderType = '1w' | '3d' | '1d' | '6h' | '1h' | '30m' | '5m' | 'custom'
export type RecurringFrequency = 'daily' | 'weekly' | 'monthly' | 'custom'
export type NotificationChannel = 'push' | 'web-push' | 'email'
export type NotificationStatus = 'pending' | 'sent' | 'failed'
export type ActivityAction =
  | 'task_created'
  | 'task_updated'
  | 'status_changed'
  | 'reminder_sent'
  | 'task_completed'
  | 'task_missed'
  | 'task_deleted'
  | 'attachment_added'
  | 'attachment_removed'

export interface JWTPayload {
  userId: string
  email: string
  iat?: number
  exp?: number
}

export interface ApiSuccessResponse<T = unknown> {
  success: true
  message: string
  data: T
  meta?: PaginationMeta
  timestamp: string
}

export interface ApiErrorResponse {
  success: false
  message: string
  data?: unknown
  timestamp: string
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface DashboardStats {
  total: number
  completed: number
  pending: number
  inProgress: number
  missed: number
  completionRate: number
}

export interface ReminderOffset {
  type: ReminderType
  offsetMs: number
}

export const REMINDER_OFFSETS: Record<Exclude<ReminderType, 'custom'>, number> = {
  '1w': 7 * 24 * 60 * 60 * 1000,
  '3d': 3 * 24 * 60 * 60 * 1000,
  '1d': 24 * 60 * 60 * 1000,
  '6h': 6 * 60 * 60 * 1000,
  '1h': 60 * 60 * 1000,
  '30m': 30 * 60 * 1000,
  '5m': 5 * 60 * 1000,
}

export const TASK_CATEGORIES: TaskCategory[] = [
  'Internship', 'Hackathon', 'Assignment', 'Meeting', 'Interview',
  'CodingContest', 'Certification', 'Exam', 'College',
  'Personal', 'JobApplication', 'Others',
]

export const TASK_PRIORITIES: TaskPriority[] = ['Low', 'Medium', 'High', 'Critical']
export const TASK_STATUSES: TaskStatus[] = ['Pending', 'InProgress', 'Completed', 'Missed']

export const PRIORITY_WEIGHT: Record<TaskPriority, number> = {
  Low: 1,
  Medium: 2,
  High: 3,
  Critical: 4,
}

export interface PopulatedUser {
  _id: Types.ObjectId
  email: string
  name: string
  fcmToken?: string
  webPushSubscription?: WebPushSubscription
}

export interface WebPushSubscription {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}