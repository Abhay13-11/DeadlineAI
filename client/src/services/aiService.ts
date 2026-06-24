import { api } from './api'
import { ApiResponse, AIMessage, ITask } from '../types'

export const aiService = {
  async sendMessage(message: string): Promise<ApiResponse<{ reply: string; taskReferences?: ITask[] }>> {
    const res = await api.post<ApiResponse<{ reply: string; taskReferences?: ITask[] }>>(
      '/ai/chat',
      { message }
    )
    return res.data
  },

  async getConversation(): Promise<ApiResponse<{ messages: AIMessage[] }>> {
    const res = await api.get<ApiResponse<{ messages: AIMessage[] }>>('/ai/conversation')
    return res.data
  },

  async clearConversation(): Promise<void> {
    await api.delete('/ai/conversation')
  },

  async createFromText(input: string): Promise<ApiResponse<Partial<ITask> & { confidence: number }>> {
    const res = await api.post<ApiResponse<Partial<ITask> & { confidence: number }>>(
      '/ai/create-from-text',
      { input }
    )
    return res.data
  },

  async confirmFromText(payload: Record<string, unknown>): Promise<ApiResponse<ITask>> {
    const res = await api.post<ApiResponse<ITask>>('/ai/create-from-text/confirm', payload)
    return res.data
  },

  async createFromImage(formData: FormData): Promise<ApiResponse<{ extractedText: string; tasks: unknown[] }>> {
    const res = await api.post<ApiResponse<{ extractedText: string; tasks: unknown[] }>>(
      '/ai/create-from-image',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    return res.data
  },

  async createFromPDF(formData: FormData): Promise<ApiResponse<{ extractedText: string; tasks: unknown[] }>> {
    const res = await api.post<ApiResponse<{ extractedText: string; tasks: unknown[] }>>(
      '/ai/create-from-pdf',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    return res.data
  },

  async suggestPlan(): Promise<ApiResponse<{ plan: string }>> {
    const res = await api.post<ApiResponse<{ plan: string }>>('/ai/suggest-plan')
    return res.data
  },
}