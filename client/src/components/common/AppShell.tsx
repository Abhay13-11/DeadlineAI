import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { useUIStore } from '../../store/uiStore'
import { TaskForm } from '../tasks/TaskForm'
import { AIChatPanel } from '../ai/AIChatPanel'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'

export function AppShell() {
  const taskFormOpen = useUIStore((s) => s.taskFormOpen)
  const closeTaskForm = useUIStore((s) => s.closeTaskForm)
  const editingTaskId = useUIStore((s) => s.editingTaskId)
  const aiPanelOpen = useUIStore((s) => s.aiPanelOpen)
  const hasStoredTheme = useUIStore((s) => s.hasStoredTheme)
  const setTheme = useUIStore((s) => s.setTheme)
  const { user } = useAuth()

  useEffect(() => {
    if (hasStoredTheme || !user?.preferences.theme) return
    const preferred = user.preferences.theme
    const resolved = preferred === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : preferred
    setTheme(resolved, false)
  }, [hasStoredTheme, setTheme, user?.preferences.theme])

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* AI Panel slides in from right */}
      {aiPanelOpen && <AIChatPanel />}

      {/* Task create/edit modal */}
      {taskFormOpen && (
        <TaskForm
          taskId={editingTaskId ?? undefined}
          onClose={closeTaskForm}
        />
      )}

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'rgb(var(--bg-elevated))',
            color: 'rgb(var(--text-primary))',
            border: '1px solid rgb(var(--border))',
            borderRadius: '10px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#22C55E', secondary: 'rgb(var(--bg-elevated))' } },
          error: { iconTheme: { primary: '#EF4444', secondary: 'rgb(var(--bg-elevated))' } },
        }}
      />
    </div>
  )
}
