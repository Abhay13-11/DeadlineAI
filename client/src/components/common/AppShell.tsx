import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { useUIStore } from '../../store/uiStore'
import { TaskForm } from '../tasks/TaskForm'
import { AIChatPanel } from '../ai/AIChatPanel'
import { Toaster } from 'react-hot-toast'

export function AppShell() {
  const { taskFormOpen, closeTaskForm, editingTaskId, aiPanelOpen } = useUIStore()

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
            background: '#1A1A24',
            color: '#F1F0FF',
            border: '1px solid #2A2A38',
            borderRadius: '10px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#22C55E', secondary: '#1A1A24' } },
          error: { iconTheme: { primary: '#EF4444', secondary: '#1A1A24' } },
        }}
      />
    </div>
  )
}