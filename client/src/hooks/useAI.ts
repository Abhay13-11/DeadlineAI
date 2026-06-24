import { useState, useCallback } from 'react'
import { aiService } from '../services/aiService'
import { AIMessage, CreateTaskPayload } from '../types'
import toast from 'react-hot-toast'

export function useAI() {
  const [messages, setMessages] = useState<AIMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = useCallback(async (text: string): Promise<string | null> => {
    if (!text.trim() || isLoading) return null
    setIsLoading(true)
    try {
      const res = await aiService.sendMessage(text)
      return res.data.reply
    } catch {
      toast.error('AI unavailable. Please try again.')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [isLoading])

  const parseTask = useCallback(async (input: string): Promise<Partial<CreateTaskPayload> | null> => {
    setIsLoading(true)
    try {
      const res = await aiService.createFromText(input)
      return res.data as Partial<CreateTaskPayload>
    } catch {
      toast.error('Failed to parse task from text.')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const suggestPlan = useCallback(async (): Promise<string | null> => {
    setIsLoading(true)
    try {
      const res = await aiService.suggestPlan()
      return res.data.plan
    } catch {
      toast.error('Failed to generate plan.')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearMessages = useCallback(() => setMessages([]), [])

  return { messages, setMessages, isLoading, sendMessage, parseTask, suggestPlan, clearMessages }
}