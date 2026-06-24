import mongoose, { Document, Schema, Model } from 'mongoose'
import { WebPushSubscription } from '../types'

export interface IUserPreferences {
  defaultReminders: string[]
  timezone: string
  theme: 'dark' | 'light' | 'system'
  notifications: {
    push: boolean
    email: boolean
  }
}

export interface IUserStats {
  totalTasks: number
  completedTasks: number
  missedTasks: number
  streakDays: number
  lastActive: Date
}

export interface IUser extends Document {
  googleId: string
  email: string
  name: string
  avatar?: string
  fcmToken?: string
  webPushSubscription?: WebPushSubscription
  preferences: IUserPreferences
  stats: IUserStats
  createdAt: Date
  updatedAt: Date
}

const PreferencesSchema = new Schema<IUserPreferences>(
  {
    defaultReminders: { type: [String], default: ['1d', '1h'] },
    timezone: { type: String, default: 'Asia/Kolkata' },
    theme: { type: String, enum: ['dark', 'light', 'system'], default: 'dark' },
    notifications: {
      push: { type: Boolean, default: true },
      email: { type: Boolean, default: false },
    },
  },
  { _id: false }
)

const StatsSchema = new Schema<IUserStats>(
  {
    totalTasks: { type: Number, default: 0 },
    completedTasks: { type: Number, default: 0 },
    missedTasks: { type: Number, default: 0 },
    streakDays: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now },
  },
  { _id: false }
)

const UserSchema = new Schema<IUser>(
  {
    googleId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    avatar: { type: String },
    fcmToken: { type: String },
    webPushSubscription: { type: Schema.Types.Mixed },
    preferences: { type: PreferencesSchema, default: () => ({}) },
    stats: { type: StatsSchema, default: () => ({}) },
  },
  { timestamps: true, versionKey: false }
)

export const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema)