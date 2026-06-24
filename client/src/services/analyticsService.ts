import { api } from './api'
import { ApiResponse } from '../types'

export const analyticsService = {
  async getOverview(): Promise<ApiResponse<unknown>> {
    const res = await api.get<ApiResponse<unknown>>('/analytics/overview')
    return res.data
  },

  async getWeekly(): Promise<ApiResponse<unknown>> {
    const res = await api.get<ApiResponse<unknown>>('/analytics/weekly')
    return res.data
  },

  async getMonthly(): Promise<ApiResponse<unknown>> {
    const res = await api.get<ApiResponse<unknown>>('/analytics/monthly')
    return res.data
  },
}