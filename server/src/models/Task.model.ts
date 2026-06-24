import mongoose, { Document, Schema, Model, Types } from 'mongoose'
import {
  TaskCategory, TaskPriority, TaskStatus, TaskSource,
  ReminderType, RecurringFrequency, TASK_CATEGORIES,
  TASK_PRIORITIES, TASK_STATUSES,
} from '../types'

export interface IAttachment {
  _id: Types.ObjectId
  name: string
  url: string
  type: string
  size: number
  uploadedAt: Date
}

export interface IReminder {
  _id: Types.ObjectId
  type: ReminderType
  customTime?: Date
  sent: boolean
  sentAt?: Date
}

export interface IRecurring {
  enabled: boolean
  frequency?: RecurringFrequency
  until?: Date
  interval: number
}

export interface ITimelineEntry {
  _id: Types.ObjectId
  action: string
  at: Date
  by: string
  metadata?: Record<string, unknown>
}

export interface IAIExtracted {
  rawInput?: string
  confidence?: number
  extractedAt?: Date
}

export interface ITask extends Document {
  userId: Types.ObjectId
  title: string
  description?: string
  category: TaskCategory
  priority: TaskPriority
  status: TaskStatus
  deadline?: Date
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
  aiExtracted?: IAIExtracted
  timeline: ITimelineEntry[]
  completedAt?: Date
  isArchived: boolean
  createdAt: Date
  updatedAt: Date
}

const AttachmentSchema = new Schema<IAttachment>(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String, required: true },
    size: { type: Number, default: 0 },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: true }
)

const ReminderSchema = new Schema<IReminder>(
  {
    type: { type: String, enum: ['1w', '3d', '1d', '6h', '1h', '30m', '5m', 'custom'], required: true },
    customTime: { type: Date },
    sent: { type: Boolean, default: false },
    sentAt: { type: Date },
  },
  { _id: true }
)

const RecurringSchema = new Schema<IRecurring>(
  {
    enabled: { type: Boolean, default: false },
    frequency: { type: String, enum: ['daily', 'weekly', 'monthly', 'custom'] },
    until: { type: Date },
    interval: { type: Number, default: 1, min: 1 },
  },
  { _id: false }
)

const TimelineSchema = new Schema<ITimelineEntry>(
  {
    action: { type: String, required: true },
    at: { type: Date, default: Date.now },
    by: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed },
  },
  { _id: true }
)

const AIExtractedSchema = new Schema<IAIExtracted>(
  {
    rawInput: { type: String },
    confidence: { type: Number, min: 0, max: 1 },
    extractedAt: { type: Date },
  },
  { _id: false }
)

const TaskSchema = new Schema<ITask>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, trim: true, maxlength: 5000 },
    category: { type: String, enum: TASK_CATEGORIES, required: true, default: 'Others' },
    priority: { type: String, enum: TASK_PRIORITIES, required: true, default: 'Medium' },
    status: { type: String, enum: TASK_STATUSES, default: 'Pending' },
    deadline: { type: Date, index: true },
    deadlineTime: { type: String, match: /^([01]?\d|2[0-3]):[0-5]\d$/ },
    location: { type: String, trim: true, maxlength: 300 },
    meetingLink: { type: String, trim: true },
    websiteLink: { type: String, trim: true },
    notes: { type: String, maxlength: 10000 },
    attachments: { type: [AttachmentSchema], default: [] },
    requiredDocuments: { type: [String], default: [] },
    reminders: { type: [ReminderSchema], default: [] },
    recurring: { type: RecurringSchema, default: () => ({ enabled: false, interval: 1 }) },
    source: { type: String, enum: ['manual', 'ai', 'ocr', 'voice', 'email'], default: 'manual' },
    aiExtracted: { type: AIExtractedSchema },
    timeline: { type: [TimelineSchema], default: [] },
    completedAt: { type: Date },
    isArchived: { type: Boolean, default: false, index: true },
  },
  { timestamps: true, versionKey: false }
)

// Compound indexes for common query patterns
TaskSchema.index({ userId: 1, status: 1 })
TaskSchema.index({ userId: 1, category: 1 })
TaskSchema.index({ userId: 1, deadline: 1 })
TaskSchema.index({ userId: 1, priority: 1 })
TaskSchema.index({ userId: 1, isArchived: 1, status: 1 })
TaskSchema.index({ userId: 1, isArchived: 1, deadline: 1 })

// Full-text search — weights title highest
TaskSchema.index(
  { title: 'text', description: 'text', notes: 'text' },
  { weights: { title: 10, description: 5, notes: 1 }, name: 'task_text_index' }
)

export const Task: Model<ITask> = mongoose.model<ITask>('Task', TaskSchema)