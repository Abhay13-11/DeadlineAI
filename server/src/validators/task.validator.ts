import { z } from 'zod'
import { TASK_CATEGORIES, TASK_PRIORITIES, TASK_STATUSES } from '../types'

const emptyToUndefined = (value: unknown): unknown =>
  typeof value === 'string' && value.trim() === '' ? undefined : value

const reminderSchema = z.object({
  type: z.enum(['1w', '3d', '1d', '6h', '1h', '30m', '5m', 'custom']),
  customTime: z.preprocess(
    emptyToUndefined,
    z.string().datetime({ offset: true }).optional()
  ),
  sent: z.boolean().default(false),
})

const recurringSchema = z.object({
  enabled: z.boolean().default(false),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'custom']).optional(),
  until: z.preprocess(
    emptyToUndefined,
    z.string().datetime({ offset: true }).optional()
  ),
  interval: z.number().int().min(1).default(1),
})

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  description: z.preprocess(emptyToUndefined, z.string().trim().max(5000).optional()),
  category: z.enum(TASK_CATEGORIES as [string, ...string[]]).default('Others'),
  priority: z.enum(TASK_PRIORITIES as [string, ...string[]]).default('Medium'),
  status: z.enum(TASK_STATUSES as [string, ...string[]]).default('Pending'),
  deadline: z.preprocess(
    emptyToUndefined,
    z.string().datetime({ offset: true }).optional()
  ),
  deadlineTime: z.preprocess(
    emptyToUndefined,
    z.string().regex(/^([01]?\d|2[0-3]):[0-5]\d$/, 'Use HH:MM format').optional()
  ),
  location: z.preprocess(emptyToUndefined, z.string().trim().max(300).optional()),
  meetingLink: z.preprocess(
    emptyToUndefined,
    z.string().url('Invalid URL').optional()
  ),
  websiteLink: z.preprocess(
    emptyToUndefined,
    z.string().url('Invalid URL').optional()
  ),
  notes: z.preprocess(emptyToUndefined, z.string().max(10000).optional()),
  requiredDocuments: z.array(z.string().trim().min(1)).max(20).default([]),
  reminders: z.array(reminderSchema).default([]),
  recurring: recurringSchema.default({ enabled: false, interval: 1 }),
  source: z.enum(['manual', 'ai', 'ocr', 'voice', 'email']).default('manual'),
})

export const updateTaskSchema = createTaskSchema.partial()

export const updateStatusSchema = z.object({
  status: z.enum(TASK_STATUSES as [string, ...string[]]),
})

export const taskQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((v) => (v ? Math.max(1, parseInt(v, 10)) : 1)),
  limit: z
    .string()
    .optional()
    .transform((v) => {
      const n = v ? parseInt(v, 10) : 20
      return Math.min(Math.max(n, 1), 100)
    }),
  category: z.enum(TASK_CATEGORIES as [string, ...string[]]).optional(),
  priority: z.enum(TASK_PRIORITIES as [string, ...string[]]).optional(),
  status: z.enum(TASK_STATUSES as [string, ...string[]]).optional(),
  search: z.string().trim().optional(),
  deadline_from: z.string().datetime({ offset: true }).optional(),
  deadline_to: z.string().datetime({ offset: true }).optional(),
  sort: z.enum(['deadline', 'createdAt', 'title', 'priority']).default('deadline'),
  order: z.enum(['asc', 'desc']).default('asc'),
  filter: z
    .enum(['today', 'tomorrow', 'this_week', 'this_month', 'overdue', 'high_priority'])
    .optional(),
})

export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>
export type TaskQueryInput = z.infer<typeof taskQuerySchema>
