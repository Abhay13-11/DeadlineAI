import { useCallback } from 'react'
import { useTaskStore } from '../store/taskStore'
import { taskService, TaskFilters } from '../services/taskService'
import { CreateTaskPayload, TaskStatus } from '../types'
import toast from 'react-hot-toast'

export function useTasks() {
  // Select individual primitives and actions — never the whole store object.
  // Zustand selectors return stable references for functions and only
  // re-render when the selected slice actually changes.
  const tasks        = useTaskStore((s) => s.tasks)
  const dashboard    = useTaskStore((s) => s.dashboard)
  const isLoading    = useTaskStore((s) => s.isLoading)
  const totalTasks   = useTaskStore((s) => s.totalTasks)
  const currentPage  = useTaskStore((s) => s.currentPage)
  const totalPages   = useTaskStore((s) => s.totalPages)
  const setTasks     = useTaskStore((s) => s.setTasks)
  const setDashboard = useTaskStore((s) => s.setDashboard)
  const setLoading   = useTaskStore((s) => s.setLoading)
  const upsertTask   = useTaskStore((s) => s.upsertTask)
  const removeTask   = useTaskStore((s) => s.removeTask)

  const fetchTasks = useCallback(async (filters: TaskFilters = {}) => {
    setLoading(true)
    try {
      const res = await taskService.getTasks(filters)
      setTasks(res.data, res.meta.total, res.meta.page, res.meta.totalPages)
    } catch {
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }, [setLoading, setTasks])  // stable Zustand action references

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await taskService.getDashboard()
      setDashboard(res.data)
    } catch {
      toast.error('Failed to load dashboard')
    }
  }, [setDashboard])  // stable

  const createTask = useCallback(async (payload: CreateTaskPayload) => {
    const res = await taskService.create(payload)
    upsertTask(res.data)
    toast.success('Task created!')
    return res.data
  }, [upsertTask])

  const updateTask = useCallback(async (id: string, payload: Partial<CreateTaskPayload>) => {
    const res = await taskService.update(id, payload)
    upsertTask(res.data)
    toast.success('Task updated')
    return res.data
  }, [upsertTask])

  const changeStatus = useCallback(async (id: string, status: TaskStatus) => {
    const res = await taskService.updateStatus(id, status)
    upsertTask(res.data)
    return res.data
  }, [upsertTask])

  const deleteTask = useCallback(async (id: string) => {
    await taskService.delete(id)
    removeTask(id)
    toast.success('Task deleted')
  }, [removeTask])

  return {
    tasks,
    dashboard,
    isLoading,
    totalTasks,
    currentPage,
    totalPages,
    fetchTasks,
    fetchDashboard,
    createTask,
    updateTask,
    changeStatus,
    deleteTask,
  }
}