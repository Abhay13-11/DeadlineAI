import { z } from 'zod'

export const chatMessageSchema = z.object({
  message: z.string().trim().min(1, 'Message cannot be empty').max(2000),
})

export const naturalLanguageTaskSchema = z.object({
  input: z.string().trim().min(1, 'Input cannot be empty').max(2000),
})

export type ChatMessageInput = z.infer<typeof chatMessageSchema>
export type NaturalLanguageTaskInput = z.infer<typeof naturalLanguageTaskSchema>