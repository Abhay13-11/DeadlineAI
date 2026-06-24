import OpenAI from 'openai'
import { env } from '../../config/env'
import { logger } from '../../utils/logger'
import {
  TaskCategory, TaskPriority, TASK_CATEGORIES, TASK_PRIORITIES,
} from '../../types'

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY })

export interface ParsedTask {
  title: string
  description?: string
  category: TaskCategory
  priority: TaskPriority
  deadline?: string
  deadlineTime?: string
  location?: string
  meetingLink?: string
  websiteLink?: string
  notes?: string
  requiredDocuments: string[]
  reminders: { type: string }[]
  confidence: number
  rawInput: string
}

const PARSER_PROMPT = `You are a task extraction AI. Extract structured task data from the user's natural language input.

Return ONLY a valid JSON object with these fields (no markdown, no code fences, no explanation):
{
  "title": "concise task title",
  "description": "optional longer description",
  "category": one of [${TASK_CATEGORIES.join(', ')}],
  "priority": one of [${TASK_PRIORITIES.join(', ')}],
  "deadline": "ISO 8601 date string or null",
  "deadlineTime": "HH:MM in 24h format or null",
  "location": "location string or null",
  "meetingLink": "URL or null",
  "websiteLink": "URL or null",
  "notes": "any additional notes or null",
  "requiredDocuments": ["array of document names like Resume, Aadhaar, GitHub etc"],
  "reminders": [{"type": "1d"}, {"type": "1h"}],
  "confidence": 0.0 to 1.0
}

Rules:
- Infer category from context (hackathon, internship, assignment, meeting, interview, etc.)
- Infer priority: deadlines within 24h = Critical, 3 days = High, 1 week = Medium, else Low
- If no deadline is mentioned, deadline = null
- For documents, detect: Resume, Cover Letter, Aadhaar, PAN Card, GitHub, LinkedIn, Portfolio, Transcript, Passport
- Default reminders: 1 day before and 1 hour before if deadline exists
- Current year is ${new Date().getFullYear()}`

export class TaskParserService {
  async parseFromText(input: string): Promise<ParsedTask> {
    const completion = await openai.chat.completions.create({
      model: env.OPENAI_MODEL,
      messages: [
        { role: 'system', content: PARSER_PROMPT },
        { role: 'user', content: input },
      ],
      max_tokens: 600,
      temperature: 0.2, // Low temp for consistent structured output
    })

    const raw = completion.choices[0]?.message?.content?.trim() ?? '{}'

    try {
      // Strip any accidental markdown fences
      const cleaned = raw.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(cleaned) as ParsedTask
      parsed.rawInput = input
      parsed.requiredDocuments = Array.isArray(parsed.requiredDocuments) ? parsed.requiredDocuments : []
      parsed.reminders = Array.isArray(parsed.reminders) ? parsed.reminders : []
      logger.info(`Task parsed: "${parsed.title}" confidence=${parsed.confidence}`)
      return parsed
    } catch (err) {
      logger.error('Task parser JSON parse error:', err, 'raw:', raw)
      throw new Error('Failed to parse task from input. Please try rephrasing.')
    }
  }

  async parseFromOCRText(extractedText: string): Promise<ParsedTask[]> {
    const multiPrompt = `${PARSER_PROMPT}

The following text was extracted from an image or PDF and may contain MULTIPLE tasks.
Extract ALL tasks you can find. Return a JSON ARRAY of task objects (same schema as above).
If only one task, still return an array with one item.`

    const completion = await openai.chat.completions.create({
      model: env.OPENAI_MODEL,
      messages: [
        { role: 'system', content: multiPrompt },
        { role: 'user', content: `Extracted text:\n\n${extractedText}` },
      ],
      max_tokens: 1500,
      temperature: 0.2,
    })

    const raw = completion.choices[0]?.message?.content?.trim() ?? '[]'

    try {
      const cleaned = raw.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(cleaned) as ParsedTask[]
      const results = Array.isArray(parsed) ? parsed : [parsed]
      return results.map((p) => ({
        ...p,
        rawInput: extractedText,
        requiredDocuments: Array.isArray(p.requiredDocuments) ? p.requiredDocuments : [],
        reminders: Array.isArray(p.reminders) ? p.reminders : [],
      }))
    } catch (err) {
      logger.error('OCR multi-task parse error:', err)
      throw new Error('Failed to extract tasks from the document.')
    }
  }
}

export const taskParserService = new TaskParserService()