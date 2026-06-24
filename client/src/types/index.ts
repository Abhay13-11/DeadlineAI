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

export interface IReminder {
  _id: string
  type: ReminderType
  customTime?: string
  sent: boolean
  sentAt?: string
}

export interface IAttachment {
  _id: string
  name: string
  url: string
  type: string
  size: number
  uploadedAt: string
}

export interface IRecurring {
  enabled: boolean
  frequency?: 'daily' | 'weekly' | 'monthly' | 'custom'
  until?: string
  interval: number
}

export interface ITimelineEntry {
  _id: string
  action: string
  at: string
  by: string
  metadata?: Record<string, unknown>
}

export interface ITask {
  _id: string
  userId: string
  title: string
  description?: string
  category: TaskCategory
  priority: TaskPriority
  status: TaskStatus
  deadline?: string
  deadlineTime?: string
  location?: string
  meetingLink?: string
  websiteLink?: string
  notes?: string
  attachments: IAttachment[]
  requiredDocuments: string[]
  reminders: IReminder[]
  recurring: IRecurring
  source: TaskSource
  timeline: ITimelineEntry[]
  completedAt?: string
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

export interface IUser {
  _id: string
  email: string
  name: string
  avatar?: string
  preferences: {
    defaultReminders: string[]
    timezone: string
    theme: 'dark' | 'light' | 'system'
    notifications: { push: boolean; email: boolean }
  }
  stats: {
    totalTasks: number
    completedTasks: number
    missedTasks: number
    streakDays: number
    lastActive: string
  }
  createdAt: string
}

export interface DashboardStats {
  total: number
  completed: number
  pending: number
  inProgress: number
  missed: number
  completionRate: number
}

export interface DashboardData {
  todayTasks: ITask[]
  upcomingTasks: ITask[]
  overdueTasks: ITask[]
  stats: DashboardStats
  recentActivity: ActivityItem[]
}

export interface ActivityItem {
  _id: string
  action: string
  metadata: Record<string, unknown>
  timestamp: string
  taskId?: { _id: string; title: string; category: TaskCategory; status: TaskStatus }
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  meta?: PaginationMeta
  timestamp: string
}

export interface AIMessage {
  _id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  taskReferences?: string[]
}

export interface CreateTaskPayload {
  title: string
  description?: string
  category: TaskCategory
  priority: TaskPriority
  status?: TaskStatus
  deadline?: string
  deadlineTime?: string
  location?: string
  meetingLink?: string
  websiteLink?: string
  notes?: string
  requiredDocuments?: string[]
  reminders?: { type: ReminderType; customTime?: string }[]
  recurring?: IRecurring
  source?: TaskSource
}

export const TASK_CATEGORIES: TaskCategory[] = [
  'Internship', 'Hackathon', 'Assignment', 'Meeting', 'Interview',
  'CodingContest', 'Certification', 'Exam', 'College',
  'Personal', 'JobApplication', 'Others',
]

export const TASK_PRIORITIES: TaskPriority[] = ['Low', 'Medium', 'High', 'Critical']
export const TASK_STATUSES: TaskStatus[] = ['Pending', 'InProgress', 'Completed', 'Missed']
export const REMINDER_TYPES: ReminderType[] = ['1w', '3d', '1d', '6h', '1h', '30m', '5m', 'custom']

export const REQUIRED_DOCUMENTS = [
  'Resume', 'Cover Letter', 'Aadhaar', 'PAN Card', 'Passport',
  'Transcript', 'Degree Certificate', 'GitHub', 'LinkedIn',
  'Portfolio', 'Offer Letter', 'NOC Letter', 'ID Proof',
]

export const CATEGORY_COLORS: Record<TaskCategory, string> = {
  Internship: '#7C6AF7',
  Hackathon: '#F59E0B',
  Assignment: '#3B82F6',
  Meeting: '#8B5CF6',
  Interview: '#EF4444',
  CodingContest: '#06B6D4',
  Certification: '#22C55E',
  Exam: '#F97316',
  College: '#6366F1',
  Personal: '#EC4899',
  JobApplication: '#14B8A6',
  Others: '#64748B',
}

export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  Low: '#64748B',
  Medium: '#3B82F6',
  High: '#F59E0B',
  Critical: '#EF4444',
}

export const STATUS_COLORS: Record<TaskStatus, string> = {
  Pending: '#8B8BA7',
  InProgress: '#3B82F6',
  Completed: '#22C55E',
  Missed: '#EF4444',
}