import { create } from 'zustand'
import { ITask, DashboardData } from '../types'

interface TaskState {
  tasks: ITask[]
  dashboard: DashboardData | null
  selectedTask: ITask | null
  isLoading: boolean
  totalTasks: number
  currentPage: number
  totalPages: number
  setTasks: (tasks: ITask[], total: number, page: number, totalPages: number) => void
  setDashboard: (data: DashboardData) => void
  setSelectedTask: (task: ITask | null) => void
  upsertTask: (task: ITask) => void
  removeTask: (id: string) => void
  setLoading: (loading: boolean) => void
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  dashboard: null,
  selectedTask: null,
  isLoading: false,
  totalTasks: 0,
  currentPage: 1,
  totalPages: 1,

  setTasks: (tasks, total, page, totalPages) =>
    set({ tasks, totalTasks: total, currentPage: page, totalPages }),

  setDashboard: (data) => set({ dashboard: data }),

  setSelectedTask: (task) => set({ selectedTask: task }),

  upsertTask: (task) => {
    const { tasks } = get()
    const idx = tasks.findIndex((t) => t._id === task._id)
    if (idx === -1) {
      set({ tasks: [task, ...tasks] })
    } else {
      const updated = [...tasks]
      updated[idx] = task
      set({ tasks: updated })
    }
  },

  removeTask: (id) =>
    set((state) => ({ tasks: state.tasks.filter((t) => t._id !== id) })),

  setLoading: (isLoading) => set({ isLoading }),
}))