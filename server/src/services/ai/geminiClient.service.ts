import {
  Content,
  GenerateContentConfig,
  GenerateContentResponse,
  GoogleGenAI,
  Part,
} from '@google/genai'
import { env } from '../../config/env'
import { AppError } from '../../utils/AppError'
import { logger } from '../../utils/logger'

const PLACEHOLDER_KEY_PATTERNS = [
  /^your[_-]?gemini/i,
  /^replace[_-]?with/i,
  /^AIzaSyReplace/i,
  /^AIzaSy-your/i,
]

export type GeminiMessage = {
  role: 'user' | 'model'
  text: string
}

export type GeminiGenerateTextOptions = {
  systemInstruction?: string
  messages?: GeminiMessage[]
  prompt?: string
  parts?: Part[]
  maxOutputTokens?: number
  temperature?: number
  responseMimeType?: string
}

export function isGeminiConfigured(apiKey = env.GEMINI_API_KEY): boolean {
  const key = apiKey.trim()
  return key.length > 20 && !PLACEHOLDER_KEY_PATTERNS.some((pattern) => pattern.test(key))
}

export function assertGeminiConfigured(apiKey = env.GEMINI_API_KEY): void {
  if (!isGeminiConfigured(apiKey)) {
    throw new AppError(
      'AI provider is not configured. Set a valid GEMINI_API_KEY on the server.',
      503
    )
  }
}

let geminiClient: GoogleGenAI | null = null

export function getGeminiClient(): GoogleGenAI {
  geminiClient ??= new GoogleGenAI({ apiKey: env.GEMINI_API_KEY })
  return geminiClient
}

function toContents(options: GeminiGenerateTextOptions): Content[] | Part[] | string {
  if (options.parts) {
    return options.parts
  }

  if (options.messages?.length) {
    return options.messages.map((message) => ({
      role: message.role,
      parts: [{ text: message.text }],
    }))
  }

  return options.prompt ?? ''
}

function providerStatus(error: unknown): number | undefined {
  return typeof error === 'object' && error !== null && 'status' in error
    ? Number((error as { status?: unknown }).status)
    : undefined
}

function providerCode(error: unknown): string | undefined {
  return typeof error === 'object' && error !== null && 'code' in error
    ? String((error as { code?: unknown }).code)
    : undefined
}

export async function generateGeminiResponse(
  options: GeminiGenerateTextOptions
): Promise<GenerateContentResponse> {
  assertGeminiConfigured()

  const config: GenerateContentConfig = {
    systemInstruction: options.systemInstruction,
    temperature: options.temperature,
    maxOutputTokens: options.maxOutputTokens,
    responseMimeType: options.responseMimeType,
  }

  try {
    return await getGeminiClient().models.generateContent({
      model: env.GEMINI_MODEL,
      contents: toContents(options),
      config,
    })
  } catch (error) {
    const status = providerStatus(error)
    const code = providerCode(error)

    logger.error({
      message: 'Gemini request failed',
      status,
      code,
      providerMessage: error instanceof Error ? error.message : String(error),
    })

    if (status === 401 || status === 403) {
      throw new AppError(
        'AI provider authentication failed. Check the server GEMINI_API_KEY.',
        503
      )
    }
    if (status === 429) {
      throw new AppError('AI provider rate limit reached. Please try again shortly.', 503)
    }

    throw new AppError('AI provider is temporarily unavailable. Please try again.', 503)
  }
}

export async function generateGeminiText(options: GeminiGenerateTextOptions): Promise<string> {
  const response = await generateGeminiResponse(options)
  return response.text?.trim() ?? ''
}