import { api } from './api'
import { ITask, ApiResponse, DashboardData, CreateTaskPayload, TaskStatus } from '../types'

export interface TaskFilters {
  page?: number
  limit?: number
  category?: string
  priority?: string
  status?: string
  search?: string
  sort?: string
  order?: 'asc' | 'desc'
  filter?: string
  deadline_from?: string
  deadline_to?: string
}

export interface PaginatedTasks {
  items: ITask[]
  total: number
  page: number
  totalPages: number
}

export const taskService = {
  async getTasks(filters: TaskFilters = {}): Promise<ApiResponse<ITask[]> & { meta: { total: number; page: number; totalPages: number; limit: number } }> {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== '') params.set(k, String(v))
    })
    const res = await api.get<ApiResponse<ITask[]> & { meta: { total: number; page: number; totalPages: number; limit: number } }>(`/tasks?${params.toString()}`)
    return res.data
  },

  async getDashboard(): Promise<ApiResponse<DashboardData>> {
    const res = await api.get<ApiResponse<DashboardData>>('/tasks/dashboard')
    return res.data
  },

  async getById(id: string): Promise<ApiResponse<ITask>> {
    const res = await api.get<ApiResponse<ITask>>(`/tasks/${id}`)
    return res.data
  },

  async create(payload: CreateTaskPayload): Promise<ApiResponse<ITask>> {
    const res = await api.post<ApiResponse<ITask>>('/tasks', payload)
    return res.data
  },

  async update(id: string, payload: Partial<CreateTaskPayload>): Promise<ApiResponse<ITask>> {
    const res = await api.put<ApiResponse<ITask>>(`/tasks/${id}`, payload)
    return res.data
  },

  async updateStatus(id: string, status: TaskStatus): Promise<ApiResponse<ITask>> {
    const res = await api.patch<ApiResponse<ITask>>(`/tasks/${id}/status`, { status })
    return res.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`)
  },
}