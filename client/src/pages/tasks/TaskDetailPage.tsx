import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Pencil, Trash2, ExternalLink, MapPin,
  Video, Paperclip, Calendar, Clock, FileText, Loader2,
} from 'lucide-react'
import { ITask } from '../../types'
import { taskService } from '../../services/taskService'
import { TaskStatusBadge } from '../../components/tasks/TaskStatusBadge'
import { TaskPriorityBadge } from '../../components/tasks/TaskPriorityBadge'
import { TaskCategoryBadge } from '../../components/tasks/TaskCategoryBadge'
import { ConfirmDialog } from '../../components/common/ConfirmDialog'
import { useUIStore } from '../../store/uiStore'
import { useTasks } from '../../hooks/useTasks'
import { formatDeadlineFull, formatRelative, formatDate } from '../../utils/formatters'
import toast from 'react-hot-toast'

export function TaskDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [task, setTask] = useState<ITask | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const { openTaskForm } = useUIStore()
  const { deleteTask } = useTasks()

  useEffect(() => {
    if (!id) return
    setLoading(true)
    taskService.getById(id)
      .then((r) => setTask(r.data))
      .catch(() => { toast.error('Task not found'); void navigate('/tasks') })
      .finally(() => setLoading(false))
  }, [id, navigate])

  const handleDelete = async () => {
    if (!id) return
    await deleteTask(id)
    void navigate('/tasks')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-6 h-6 animate-spin text-accent-violet" />
      </div>
    )
  }

  if (!task) return null

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Back + actions */}
      <div className="flex items-center justify-between">
        <button onClick={() => void navigate(-1)} className="btn-ghost flex items-center gap-2 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex gap-2">
          <button onClick={() => openTaskForm(task._id)} className="btn-secondary flex items-center gap-2 text-sm">
            <Pencil className="w-4 h-4" /> Edit
          </button>
          <button onClick={() => setDeleteOpen(true)} className="btn-secondary text-accent-danger border-accent-danger/20 hover:bg-accent-danger/5 flex items-center gap-2 text-sm">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>

      {/* Main card */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-background-surface border border-border rounded-xl p-6 space-y-5">
        {/* Header */}
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            <TaskCategoryBadge category={task.category} />
            <TaskPriorityBadge priority={task.priority} />
            <TaskStatusBadge status={task.status} size="md" />
          </div>
          <h1 className="text-xl font-bold font-display text-text-primary">{task.title}</h1>
          {task.description && <p className="text-text-secondary mt-2 text-sm leading-relaxed">{task.description}</p>}
        </div>

        {/* Deadline */}
        {task.deadline && (
          <InfoRow icon={Calendar} label="Deadline">
            {formatDeadlineFull(task.deadline, task.deadlineTime)}
          </InfoRow>
        )}

        {task.location && <InfoRow icon={MapPin} label="Location">{task.location}</InfoRow>}

        {task.meetingLink && (
          <InfoRow icon={Video} label="Meeting Link">
            <a href={task.meetingLink} target="_blank" rel="noopener noreferrer"
               className="text-accent-violet hover:underline flex items-center gap-1">
              Join Meeting <ExternalLink className="w-3 h-3" />
            </a>
          </InfoRow>
        )}

        {task.websiteLink && (
          <InfoRow icon={ExternalLink} label="Website">
            <a href={task.websiteLink} target="_blank" rel="noopener noreferrer"
               className="text-accent-violet hover:underline">
              {task.websiteLink}
            </a>
          </InfoRow>
        )}

        {task.requiredDocuments.length > 0 && (
          <InfoRow icon={FileText} label="Required Documents">
            <div className="flex flex-wrap gap-1.5 mt-1">
              {task.requiredDocuments.map((doc) => (
                <span key={doc} className="text-xs bg-background-elevated border border-border px-2 py-0.5 rounded-full text-text-secondary">
                  {doc}
                </span>
              ))}
            </div>
          </InfoRow>
        )}

        {task.notes && (
          <div className="border-t border-border pt-4">
            <p className="text-xs font-medium text-text-secondary mb-2">Notes</p>
            <p className="text-sm text-text-primary whitespace-pre-wrap leading-relaxed">{task.notes}</p>
          </div>
        )}

        {task.attachments.length > 0 && (
          <div className="border-t border-border pt-4">
            <p className="text-xs font-medium text-text-secondary mb-2 flex items-center gap-1.5">
              <Paperclip className="w-3 h-3" /> Attachments ({task.attachments.length})
            </p>
            <div className="space-y-1.5">
              {task.attachments.map((a) => (
                <a key={a._id} href={a.url} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 text-sm text-accent-violet hover:underline">
                  <Paperclip className="w-3.5 h-3.5" /> {a.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Timeline */}
      {task.timeline.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-background-surface border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-text-muted" /> Timeline
          </h3>
          <div className="space-y-3">
            {[...task.timeline].reverse().map((entry) => (
              <div key={entry._id} className="flex items-start gap-3 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-violet mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-text-primary">{entry.action}</p>
                  <p className="text-text-muted text-xs mt-0.5">{formatRelative(entry.at)}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <p className="text-text-muted text-xs text-center">
        Created {formatDate(task.createdAt)} · Last updated {formatRelative(task.updatedAt)}
      </p>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete task?"
        description={`"${task.title}" will be permanently removed.`}
        confirmLabel="Delete"
        onConfirm={() => void handleDelete()}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  )
}

function InfoRow({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-4 h-4 text-text-muted mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-xs text-text-muted mb-0.5">{label}</p>
        <div className="text-sm text-text-primary">{children}</div>
      </div>
    </div>
  )
}