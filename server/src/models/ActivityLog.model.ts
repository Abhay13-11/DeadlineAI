import mongoose, { Document, Schema, Model, Types } from 'mongoose'
import { ActivityAction } from '../types'

export interface IActivityLog extends Document {
  userId: Types.ObjectId
  taskId: Types.ObjectId
  action: ActivityAction
  metadata: Record<string, unknown>
  timestamp: Date
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true, index: true },
    action: {
      type: String,
      required: true,
      enum: [
        'task_created', 'task_updated', 'status_changed', 'reminder_sent',
        'task_completed', 'task_missed', 'task_deleted',
        'attachment_added', 'attachment_removed',
      ],
    },
    metadata: { type: Schema.Types.Mixed, default: {} },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { versionKey: false }
)

ActivityLogSchema.index({ userId: 1, timestamp: -1 })
ActivityLogSchema.index({ taskId: 1, timestamp: -1 })

export const ActivityLog: Model<IActivityLog> = mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema)