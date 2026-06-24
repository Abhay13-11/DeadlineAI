import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { TaskStatus, TASK_STATUSES } from '../../types'
import { TaskCard } from '../../components/tasks/TaskCard'
import { PageHeader } from '../../components/common/PageHeader'
import { useTasks } from '../../hooks/useTasks'
import { groupTasksByStatus } from '../../utils/taskUtils'
import { formatCategoryLabel } from '../../utils/formatters'
import { useUIStore } from '../../store/uiStore'
import { Plus } from 'lucide-react'
import { cn } from '../../lib/utils'

const COLUMN_CONFIG: Record<TaskStatus, { color: string; bg: string }> = {
  Pending:    { color: '#8B8BA7', bg: 'rgba(139,139,167,0.06)' },
  InProgress: { color: '#3B82F6', bg: 'rgba(59,130,246,0.06)'  },
  Completed:  { color: '#22C55E', bg: 'rgba(34,197,94,0.06)'   },
  Missed:     { color: '#EF4444', bg: 'rgba(239,68,68,0.06)'   },
}

export function KanbanPage() {
  const { tasks, isLoading, fetchTasks, changeStatus } = useTasks()
  const { openTaskForm } = useUIStore()
  const [dragging, setDragging] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState<TaskStatus | null>(null)

  useEffect(() => { void fetchTasks({ limit: 100, sort: 'priority', order: 'desc' }) }, [fetchTasks])

  const grouped = groupTasksByStatus(tasks)

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId)
    setDragging(taskId)
  }

  const handleDrop = async (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData('taskId')
    if (taskId) await changeStatus(taskId, status)
    setDragging(null)
    setDragOver(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-6 h-6 animate-spin text-accent-violet" />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Kanban Board"
        description="Drag tasks between columns to update their status."
        actions={
          <button onClick={() => openTaskForm()} className="btn-primary flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> New Task
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 pb-4">
        {TASK_STATUSES.map((status) => {
          const col = COLUMN_CONFIG[status]
          const colTasks = grouped[status] ?? []
          return (
            <div
              key={status}
              onDragOver={(e) => { e.preventDefault(); setDragOver(status) }}
              onDragLeave={() => setDragOver(null)}
              onDrop={(e) => void handleDrop(e, status)}
              className={cn(
                'rounded-xl border transition-all min-h-[200px] flex flex-col',
                dragOver === status ? 'border-accent-violet/50 scale-[1.01]' : 'border-border'
              )}
              style={{ background: col.bg }}
            >
              {/* Column header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
                  <span className="text-sm font-semibold text-text-primary">{formatCategoryLabel(status)}</span>
                </div>
                <span className="text-xs bg-background-elevated border border-border text-text-secondary px-2 py-0.5 rounded-full">
                  {colTasks.length}
                </span>
              </div>

              {/* Cards */}
              <div className="flex-1 p-3 space-y-2 overflow-y-auto">
                {colTasks.map((task) => (
                  <motion.div
                    key={task._id}
                    layout
                    draggable
                    onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, task._id)}
                    onDragEnd={() => setDragging(null)}
                    className={cn(
                      'cursor-grab active:cursor-grabbing rounded-md transition-opacity',
                      dragging === task._id && 'opacity-50'
                    )}
                  >
                    <TaskCard task={task} compact />
                  </motion.div>
                ))}

                {colTasks.length === 0 && (
                  <p className="text-text-muted text-xs text-center py-8">Drop tasks here</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}