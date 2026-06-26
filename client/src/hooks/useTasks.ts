import { useCallback } from 'react'
import { useTaskStore } from '../store/taskStore'
import { taskService, TaskFilters } from '../services/taskService'
import { CreateTaskPayload, DashboardData, TaskStatus } from '../types'
import toast from 'react-hot-toast'

let dashboardRequest: Promise<DashboardData> | null = null

export function useTasks() {
  // Select individual primitives and actions — never the whole store object.
  // Zustand selectors return stable references for functions and only
  // re-render when the selected slice actually changes.
  const tasks        = useTaskStore((s) => s.tasks)
  const dashboard    = useTaskStore((s) => s.dashboard)
  const dashboardStatus = useTaskStore((s) => s.dashboardStatus)
  const isLoading    = useTaskStore((s) => s.isLoading)
  const totalTasks   = useTaskStore((s) => s.totalTasks)
  const currentPage  = useTaskStore((s) => s.currentPage)
  const totalPages   = useTaskStore((s) => s.totalPages)
  const setTasks     = useTaskStore((s) => s.setTasks)
  const setDashboard = useTaskStore((s) => s.setDashboard)
  const setDashboardStatus = useTaskStore((s) => s.setDashboardStatus)
  const setLoading   = useTaskStore((s) => s.setLoading)
  const upsertTask   = useTaskStore((s) => s.upsertTask)
  const removeTask   = useTaskStore((s) => s.removeTask)

  const fetchTasks = useCallback(async (filters: TaskFilters = {}) => {
    setLoading(true)
    try {
      const res = await taskService.getTasks(filters)
      setTasks(res.data, res.meta.total, res.meta.page, res.meta.totalPages)
    } catch {
      toast.error('Failed to load tasks', { id: 'tasks-load-error' })
    } finally {
      setLoading(false)
    }
  }, [setLoading, setTasks])  // stable Zustand action references

  const fetchDashboard = useCallback(async (force = false): Promise<DashboardData> => {
    const state = useTaskStore.getState()
    if (!force && state.dashboardStatus === 'loaded' && state.dashboard) {
      return state.dashboard
    }
    if (dashboardRequest) {
      if (!force) return dashboardRequest
      return dashboardRequest
        .catch(() => undefined)
        .then(() => fetchDashboard(true))
    }

    setDashboardStatus('loading')
    dashboardRequest = taskService.getDashboard()
      .then((res) => {
        setDashboard(res.data)
        return res.data
      })
      .catch((error: unknown) => {
        setDashboardStatus('error')
        toast.error('Failed to load dashboard', { id: 'dashboard-load-error' })
        throw error
      })
      .finally(() => {
        dashboardRequest = null
      })

    return dashboardRequest
  }, [setDashboard, setDashboardStatus])

  const createTask = useCallback(async (
    payload: CreateTaskPayload,
    options: { silent?: boolean } = {}
  ) => {
    const res = await taskService.create(payload)
    upsertTask(res.data)
    if (useTaskStore.getState().dashboard) {
      await fetchDashboard(true).catch(() => undefined)
    }
    if (!options.silent) {
      toast.success('Task created!')
    }
    return res.data
  }, [fetchDashboard, upsertTask])

  const updateTask = useCallback(async (id: string, payload: Partial<CreateTaskPayload>) => {
    const res = await taskService.update(id, payload)
    upsertTask(res.data)
    if (useTaskStore.getState().dashboard) {
      await fetchDashboard(true).catch(() => undefined)
    }
    toast.success('Task updated')
    return res.data
  }, [fetchDashboard, upsertTask])

  const changeStatus = useCallback(async (id: string, status: TaskStatus) => {
    const res = await taskService.updateStatus(id, status)
    upsertTask(res.data)
    if (useTaskStore.getState().dashboard) {
      await fetchDashboard(true).catch(() => undefined)
    }
    return res.data
  }, [fetchDashboard, upsertTask])

  const deleteTask = useCallback(async (id: string) => {
    await taskService.delete(id)
    removeTask(id)
    if (useTaskStore.getState().dashboard) {
      await fetchDashboard(true).catch(() => undefined)
    }
    toast.success('Task deleted')
  }, [fetchDashboard, removeTask])

  return {
    tasks,
    dashboard,
    dashboardStatus,
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