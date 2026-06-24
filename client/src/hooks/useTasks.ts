import { useCallback } from 'react'
import { useTaskStore } from '../store/taskStore'
import { taskService, TaskFilters } from '../services/taskService'
import { CreateTaskPayload, TaskStatus } from '../types'
import toast from 'react-hot-toast'

export function useTasks() {
  const store = useTaskStore()

  const fetchTasks = useCallback(async (filters: TaskFilters = {}) => {
    store.setLoading(true)
    try {
      const res = await taskService.getTasks(filters)
      store.setTasks(res.data, res.meta.total, res.meta.page, res.meta.totalPages)
    } catch {
      toast.error('Failed to load tasks')
    } finally {
      store.setLoading(false)
    }
  }, [store])

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await taskService.getDashboard()
      store.setDashboard(res.data)
    } catch {
      toast.error('Failed to load dashboard')
    }
  }, [store])

  const createTask = useCallback(async (payload: CreateTaskPayload) => {
    const res = await taskService.create(payload)
    store.upsertTask(res.data)
    toast.success('Task created!')
    return res.data
  }, [store])

  const updateTask = useCallback(async (id: string, payload: Partial<CreateTaskPayload>) => {
    const res = await taskService.update(id, payload)
    store.upsertTask(res.data)
    toast.success('Task updated')
    return res.data
  }, [store])

  const changeStatus = useCallback(async (id: string, status: TaskStatus) => {
    const res = await taskService.updateStatus(id, status)
    store.upsertTask(res.data)
    return res.data
  }, [store])

  const deleteTask = useCallback(async (id: string) => {
    await taskService.delete(id)
    store.removeTask(id)
    toast.success('Task deleted')
  }, [store])

  return {
    tasks: store.tasks,
    dashboard: store.dashboard,
    isLoading: store.isLoading,
    totalTasks: store.totalTasks,
    currentPage: store.currentPage,
    totalPages: store.totalPages,
    fetchTasks,
    fetchDashboard,
    createTask,
    updateTask,
    changeStatus,
    deleteTask,
  }
}