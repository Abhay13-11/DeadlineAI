import mongoose, { Document, Schema, Model, Types } from 'mongoose'
import { NotificationChannel, NotificationStatus } from '../types'

export interface IReminderLog extends Document {
  taskId: Types.ObjectId
  userId: Types.ObjectId
  reminderType: string
  scheduledFor: Date
  sentAt?: Date
  channel: NotificationChannel
  status: NotificationStatus
  errorMessage?: string
  createdAt: Date
}

const ReminderLogSchema = new Schema<IReminderLog>(
  {
    taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    reminderType: { type: String, required: true },
    scheduledFor: { type: Date, required: true, index: true },
    sentAt: { type: Date },
    channel: { type: String, enum: ['push', 'web-push', 'email'], required: true },
    status: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
    errorMessage: { type: String },
  },
  { timestamps: true, versionKey: false }
)

ReminderLogSchema.index({ userId: 1, status: 1 })
ReminderLogSchema.index({ scheduledFor: 1, status: 1 })

export const ReminderLog: Model<IReminderLog> = mongoose.model<IReminderLog>('ReminderLog', ReminderLogSchema)