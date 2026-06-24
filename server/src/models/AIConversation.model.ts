import mongoose, { Document, Schema, Model, Types } from 'mongoose'

export interface IMessage {
  _id: Types.ObjectId
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  taskReferences: Types.ObjectId[]
}

export interface IAIConversation extends Document {
  userId: Types.ObjectId
  messages: IMessage[]
  createdAt: Date
  updatedAt: Date
}

const MessageSchema = new Schema<IMessage>(
  {
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    taskReferences: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
  },
  { _id: true }
)

const AIConversationSchema = new Schema<IAIConversation>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    messages: {
      type: [MessageSchema],
      default: [],
    },
  },
  { timestamps: true, versionKey: false }
)

export const AIConversation: Model<IAIConversation> = mongoose.model<IAIConversation>(
  'AIConversation',
  AIConversationSchema
)