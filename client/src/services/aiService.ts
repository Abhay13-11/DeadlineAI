import { api } from './api'
import { ApiResponse, AIMessage, ITask } from '../types'

export const aiService = {
  async sendMessage(message: string): Promise<ApiResponse<{ reply: string; taskReferences?: ITask[] }>> {
    const res = await api.post<ApiResponse<{ reply: string; taskReferences?: ITask[] }>>('/ai/chat', { message })
    return res.data
  },

  async getConversation(): Promise<ApiResponse<{ messages: AIMessage[] }>> {
    const res = await api.get<ApiResponse<{ messages: AIMessage[] }>>('/ai/conversation')
    return res.data
  },

  async clearConversation(): Promise<void> {
    await api.delete('/ai/conversation')
  },

  async createFromText(input: string): Promise<ApiResponse<Partial<ITask>>> {
    const res = await api.post<ApiResponse<Partial<ITask>>>('/ai/create-from-text', { input })
    return res.data
  },

  async suggestPlan(): Promise<ApiResponse<string>> {
    const res = await api.post<ApiResponse<string>>('/ai/suggest-plan')
    return res.data
  },
}