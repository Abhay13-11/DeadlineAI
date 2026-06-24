import { motion } from 'framer-motion'
import { Calendar, Clock, Paperclip, MoreVertical, Pencil, Trash2, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import { ITask } from '../../types'
import { TaskStatusBadge } from './TaskStatusBadge'
import { TaskPriorityBadge } from './TaskPriorityBadge'
import { TaskCategoryBadge } from './TaskCategoryBadge'
import { formatDeadline, isOverdue } from '../../utils/formatters'
import { cn } from '../../lib/utils'
import { ConfirmDialog } from '../common/ConfirmDialog'
import { useUIStore } from '../../store/uiStore'
import { useTasks } from '../../hooks/useTasks'
import { useNavigate } from 'react-router-dom'

interface Props {
  task: ITask
  compact?: boolean
}

export function TaskCard({ task, compact = false }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const { openTaskForm } = useUIStore()
  const { deleteTask, changeStatus } = useTasks()
  const navigate = useNavigate()

  const overdue = task.status !== 'Completed' && task.status !== 'Missed' && isOverdue(task.deadline)

  const handleComplete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await changeStatus(task._id, task.status === 'Completed' ? 'Pending' : 'Completed')
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    setMenuOpen(false)
    openTaskForm(task._id)
  }

  const handleDelete = async () => {
    await deleteTask(task._id)
    setDeleteOpen(false)
  }

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        onClick={() => void navigate(`/tasks/${task._id}`)}
        className={cn(
          'group relative bg-background-surface border border-border rounded-lg cursor-pointer',
          'hover:border-border-hover hover:shadow-card transition-all duration-200',
          overdue && 'border-accent-danger/30 hover:border-accent-danger/50',
          compact ? 'p-3' : 'p-4'
        )}
      >
        {/* Top row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            {/* Complete toggle */}
            <button
              onClick={handleComplete}
              className={cn(
                'mt-0.5 flex-shrink-0 w-4 h-4 rounded border transition-all',
                task.status === 'Completed'
                  ? 'bg-accent-success border-accent-success text-white'
                  : 'border-border hover:border-accent-violet'
              )}
              title={task.status === 'Completed' ? 'Mark incomplete' : 'Mark complete'}
            >
              {task.status === 'Completed' && <CheckCircle className="w-4 h-4" />}
            </button>

            <h3 className={cn(
              'text-sm font-medium leading-snug line-clamp-2',
              task.status === 'Completed' ? 'line-through text-text-muted' : 'text-text-primary'
            )}>
              {task.title}
            </h3>
          </div>

          {/* Menu */}
          <div className="relative flex-shrink-0">
            <button
              onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen) }}
              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-background-elevated text-text-muted hover:text-text-primary transition-all"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 top-6 z-20 bg-background-elevated border border-border rounded-lg shadow-lg py-1 w-36"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={handleEdit}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-border/30"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setMenuOpen(false); setDeleteOpen(true) }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-accent-danger hover:bg-accent-danger/5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Badges */}
        {!compact && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            <TaskCategoryBadge category={task.category} />
            <TaskPriorityBadge priority={task.priority} />
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            {task.deadline && (
              <span className={cn(
                'flex items-center gap-1 text-xs',
                overdue ? 'text-accent-danger' : 'text-text-muted'
              )}>
                <Calendar className="w-3 h-3" />
                {formatDeadline(task.deadline)}
              </span>
            )}
            {task.deadlineTime && (
              <span className="flex items-center gap-1 text-xs text-text-muted">
                <Clock className="w-3 h-3" />
                {task.deadlineTime}
              </span>
            )}
            {task.attachments.length > 0 && (
              <span className="flex items-center gap-1 text-xs text-text-muted">
                <Paperclip className="w-3 h-3" />
                {task.attachments.length}
              </span>
            )}
          </div>
          <TaskStatusBadge status={task.status} />
        </div>

        {/* Overdue indicator */}
        {overdue && (
          <div className="absolute top-0 left-0 w-0.5 h-full bg-accent-danger rounded-l-lg" />
        )}
      </motion.div>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete task?"
        description={`"${task.title}" will be permanently removed.`}
        confirmLabel="Delete"
        onConfirm={() => void handleDelete()}
        onCancel={() => setDeleteOpen(false)}
      />
    </>
  )
}