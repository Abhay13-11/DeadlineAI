import { create } from 'zustand'

export type Theme = 'dark' | 'light'

const THEME_STORAGE_KEY = 'deadlineai-theme'

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === 'dark' || stored === 'light') return stored
  if (document.documentElement.classList.contains('dark')) return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  document.documentElement.dataset.theme = theme
}

interface UIState {
  sidebarOpen: boolean
  taskFormOpen: boolean
  editingTaskId: string | null
  aiPanelOpen: boolean
  theme: Theme
  hasStoredTheme: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  openTaskForm: (editId?: string) => void
  closeTaskForm: () => void
  toggleAIPanel: () => void
  setAIPanelOpen: (open: boolean) => void
  setTheme: (theme: Theme, persist?: boolean) => void
}

const initialTheme = getInitialTheme()
applyTheme(initialTheme)

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  taskFormOpen: false,
  editingTaskId: null,
  aiPanelOpen: false,
  theme: initialTheme,
  hasStoredTheme: localStorage.getItem(THEME_STORAGE_KEY) !== null,

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  openTaskForm: (editId) => set({ taskFormOpen: true, editingTaskId: editId ?? null }),
  closeTaskForm: () => set({ taskFormOpen: false, editingTaskId: null }),

  toggleAIPanel: () => set((s) => ({ aiPanelOpen: !s.aiPanelOpen })),
  setAIPanelOpen: (open) => set({ aiPanelOpen: open }),

  setTheme: (theme, persist = true) => {
    applyTheme(theme)
    if (persist) {
      localStorage.setItem(THEME_STORAGE_KEY, theme)
    }
    set({ theme, hasStoredTheme: persist || localStorage.getItem(THEME_STORAGE_KEY) !== null })
  },
}))
