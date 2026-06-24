import { Request, Response } from 'express'
import { IUser } from '../models/User.model'
import { aiChatService } from '../services/ai/aiChat.service'
import { taskParserService } from '../services/ai/taskParser.service'
import { ocrService } from '../services/ai/ocr.service'
import { plannerService } from '../services/ai/planner.service'
import { taskService } from '../services/task.service'
import { sendSuccess, sendError } from '../utils/apiResponse'
import { logger } from '../utils/logger'

// POST /ai/chat
export async function chat(req: Request, res: Response): Promise<void> {
  const user = req.user as IUser
  const { message } = req.body as { message: string }

  const reply = await aiChatService.chat(user._id.toString(), message)
  sendSuccess(res, { reply })
}

// GET /ai/conversation
export async function getConversation(req: Request, res: Response): Promise<void> {
  const user = req.user as IUser
  const messages = await aiChatService.getConversation(user._id.toString())
  sendSuccess(res, { messages })
}

// DELETE /ai/conversation
export async function clearConversation(req: Request, res: Response): Promise<void> {
  const user = req.user as IUser
  await aiChatService.clearConversation(user._id.toString())
  sendSuccess(res, null, 'Conversation cleared')
}

// POST /ai/create-from-text
export async function createFromText(req: Request, res: Response): Promise<void> {
  const user = req.user as IUser
  const { input } = req.body as { input: string }

  const parsed = await taskParserService.parseFromText(input)
  sendSuccess(res, parsed, 'Task extracted from text')
}

// POST /ai/create-from-text/confirm
// Creates the actual task after user confirms the parsed preview
export async function confirmFromText(req: Request, res: Response): Promise<void> {
  const user = req.user as IUser
  const payload = req.body as Record<string, unknown>

  const task = await taskService.create(user._id.toString(), {
    title: payload.title as string,
    description: payload.description as string | undefined,
    category: payload.category as never,
    priority: payload.priority as never,
    status: 'Pending',
    deadline: payload.deadline as string | undefined,
    deadlineTime: payload.deadlineTime as string | undefined,
    notes: payload.notes as string | undefined,
    requiredDocuments: (payload.requiredDocuments as string[]) ?? [],
    reminders:
  ((payload.reminders as {
    type: '5m' | '30m' | '1h' | '6h' | '1d' | '3d' | '1w' | 'custom'
    sent?: boolean
    customTime?: string
  }[])?.map((r) => ({
    type: r.type,
    sent: r.sent ?? false,
    customTime: r.customTime,
  }))) ?? [],
    source: 'ai',
    recurring: { enabled: false, interval: 1 },
  })

  sendSuccess(res, task, 'Task created from AI', 201)
}

// POST /ai/create-from-image  (multipart/form-data, field: "file")
export async function createFromImage(req: Request, res: Response): Promise<void> {
  const file = req.file
  if (!file) {
    sendError(res, 'No image file uploaded', 400)
    return
  }

  logger.info(`OCR image upload: ${file.originalname} (${file.mimetype}) ${file.size}B`)

  const extractedText = await ocrService.extractFromImageBuffer(file.buffer, file.mimetype)
  const tasks = await taskParserService.parseFromOCRText(extractedText)

  sendSuccess(res, { extractedText, tasks }, `Extracted ${tasks.length} task(s) from image`)
}

// POST /ai/create-from-pdf  (multipart/form-data, field: "file")
export async function createFromPDF(req: Request, res: Response): Promise<void> {
  const file = req.file
  if (!file) {
    sendError(res, 'No PDF file uploaded', 400)
    return
  }

  logger.info(`OCR PDF upload: ${file.originalname} ${file.size}B`)

  const extractedText = await ocrService.extractFromPDFBuffer(file.buffer)
  const tasks = await taskParserService.parseFromOCRText(extractedText)

  sendSuccess(res, { extractedText, tasks }, `Extracted ${tasks.length} task(s) from PDF`)
}

// POST /ai/suggest-plan
export async function suggestPlan(req: Request, res: Response): Promise<void> {
  const user = req.user as IUser
  const plan = await plannerService.generateDailyPlan(user._id.toString())
  sendSuccess(res, { plan })
}