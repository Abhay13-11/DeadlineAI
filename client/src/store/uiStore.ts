import { create } from 'zustand'

interface UIState {
  sidebarOpen: boolean
  taskFormOpen: boolean
  editingTaskId: string | null
  aiPanelOpen: boolean
  theme: 'dark' | 'light'
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  openTaskForm: (editId?: string) => void
  closeTaskForm: () => void
  toggleAIPanel: () => void
  setAIPanelOpen: (open: boolean) => void
  setTheme: (theme: 'dark' | 'light') => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  taskFormOpen: false,
  editingTaskId: null,
  aiPanelOpen: false,
  theme: 'dark',

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  openTaskForm: (editId) => set({ taskFormOpen: true, editingTaskId: editId ?? null }),
  closeTaskForm: () => set({ taskFormOpen: false, editingTaskId: null }),

  toggleAIPanel: () => set((s) => ({ aiPanelOpen: !s.aiPanelOpen })),
  setAIPanelOpen: (open) => set({ aiPanelOpen: open }),

  setTheme: (theme) => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    set({ theme })
  },
}))