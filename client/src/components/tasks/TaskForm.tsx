import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Trash2, Loader2 } from 'lucide-react'
import {
  TASK_CATEGORIES, TASK_PRIORITIES, TASK_STATUSES,
  REQUIRED_DOCUMENTS, REMINDER_TYPES,
  TaskCategory, TaskPriority, TaskStatus, ReminderType, CreateTaskPayload
} from '../../types'
import { formatCategoryLabel } from '../../utils/formatters'
import { useTasks } from '../../hooks/useTasks'
import { taskService } from '../../services/taskService'
import { cn } from '../../lib/utils'
import {
  buildDeadlineISOString,
  buildLocalDateTimeISOString,
  formatDateInputValue,
  formatDateTimeLocalInputValue,
} from '../../utils/taskUtils'
import toast from 'react-hot-toast'

interface Props {
  taskId?: string
  onClose: () => void
  prefill?: Partial<CreateTaskPayload>
}

const DEFAULT: CreateTaskPayload = {
  title: '', description: '', category: 'Others', priority: 'Medium',
  status: 'Pending', deadline: '', deadlineTime: '', location: '',
  meetingLink: '', websiteLink: '', notes: '',
  requiredDocuments: [], reminders: [], source: 'manual',
}

function normalizeFormInput(input?: Partial<CreateTaskPayload>): CreateTaskPayload {
  const merged = { ...DEFAULT, ...input }
  return {
    ...merged,
    deadline: formatDateInputValue(merged.deadline),
    deadlineTime: merged.deadlineTime ?? '',
    reminders: (merged.reminders ?? []).map((reminder) => ({
      ...reminder,
      customTime: formatDateTimeLocalInputValue(reminder.customTime),
    })),
  }
}

export function TaskForm({ taskId, onClose, prefill }: Props) {
  const [form, setForm] = useState<CreateTaskPayload>(() => normalizeFormInput(prefill))
  const [activeTab, setActiveTab] = useState<'basic' | 'details' | 'reminders'>('basic')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const { createTask, updateTask } = useTasks()
  const isEditing = !!taskId

  useEffect(() => {
    if (!taskId) return
    setFetching(true)
    taskService.getById(taskId)
      .then((res) => {
        const t = res.data
        setForm({
          title: t.title, description: t.description ?? '',
          category: t.category, priority: t.priority, status: t.status,
          deadline: formatDateInputValue(t.deadline),
          deadlineTime: t.deadlineTime ?? '',
          location: t.location ?? '', meetingLink: t.meetingLink ?? '',
          websiteLink: t.websiteLink ?? '', notes: t.notes ?? '',
          requiredDocuments: t.requiredDocuments,
          reminders: t.reminders.map((r) => ({
            type: r.type,
            customTime: formatDateTimeLocalInputValue(r.customTime),
          })),
          source: t.source,
        })
      })
      .catch(() => toast.error('Failed to load task'))
      .finally(() => setFetching(false))
  }, [taskId])

  const set = <K extends keyof CreateTaskPayload>(key: K, val: CreateTaskPayload[K]) =>
    setForm((f) => ({ ...f, [key]: val }))

  const toggleDoc = (doc: string) => {
    const docs = form.requiredDocuments ?? []
    set('requiredDocuments', docs.includes(doc) ? docs.filter((d) => d !== doc) : [...docs, doc])
  }

  const addReminder = () => {
    const existing = form.reminders ?? []
    set('reminders', [...existing, { type: '1d' as ReminderType }])
  }

  const removeReminder = (i: number) => {
    const r = [...(form.reminders ?? [])]
    r.splice(i, 1)
    set('reminders', r)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) { toast.error('Title is required'); return }
    if ((form.reminders ?? []).some((reminder) => reminder.type === 'custom' && !reminder.customTime)) {
      toast.error('Choose a time for custom reminders')
      setActiveTab('reminders')
      return
    }
    setLoading(true)
    try {
      const payload: CreateTaskPayload = {
        ...form,
        deadline: buildDeadlineISOString(form.deadline, form.deadlineTime),
        deadlineTime: form.deadlineTime || undefined,
        description: form.description || undefined,
        location: form.location || undefined,
        meetingLink: form.meetingLink || undefined,
        websiteLink: form.websiteLink || undefined,
        notes: form.notes || undefined,
        reminders: (form.reminders ?? []).map((reminder) => ({
          ...reminder,
          customTime: buildLocalDateTimeISOString(reminder.customTime),
        })),
      }
      if (isEditing) {
        await updateTask(taskId, payload)
      } else {
        await createTask(payload)
      }
      onClose()
    } catch {
      toast.error('Failed to save task')
    } finally {
      setLoading(false)
    }
  }

  const TABS = ['basic', 'details', 'reminders'] as const

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          className="relative bg-background-elevated border border-border rounded-xl w-full max-w-xl shadow-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-display font-semibold text-text-primary">
              {isEditing ? 'Edit Task' : 'Create New Task'}
            </h2>
            <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border px-5">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'py-3 px-4 text-sm font-medium capitalize border-b-2 -mb-px transition-colors',
                  activeTab === tab
                    ? 'border-accent-violet text-accent-violet'
                    : 'border-transparent text-text-secondary hover:text-text-primary'
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {fetching ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-accent-violet" />
            </div>
          ) : (
            <form onSubmit={(e) => void handleSubmit(e)}>
              <div className="px-5 py-4 space-y-4 max-h-[60vh] overflow-y-auto">

                {/* BASIC TAB */}
                {activeTab === 'basic' && (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1.5">
                        Title <span className="text-accent-danger">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.title}
                        onChange={(e) => set('title', e.target.value)}
                        placeholder="e.g. Submit HackVega registration"
                        className="input-base"
                        autoFocus
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1.5">Description</label>
                      <textarea
                        value={form.description}
                        onChange={(e) => set('description', e.target.value)}
                        placeholder="Add more context..."
                        rows={3}
                        className="input-base resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1.5">Category</label>
                        <select value={form.category} onChange={(e) => set('category', e.target.value as TaskCategory)} className="input-base">
                          {TASK_CATEGORIES.map((c) => <option key={c} value={c}>{formatCategoryLabel(c)}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1.5">Priority</label>
                        <select value={form.priority} onChange={(e) => set('priority', e.target.value as TaskPriority)} className="input-base">
                          {TASK_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1.5">Deadline Date</label>
                        <input
                          type="date"
                          value={form.deadline ?? ''}
                          onChange={(e) => set('deadline', e.target.value)}
                          className="input-base"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1.5">Deadline Time</label>
                        <input
                          type="time"
                          value={form.deadlineTime ?? ''}
                          onChange={(e) => set('deadlineTime', e.target.value)}
                          className="input-base"
                        />
                      </div>
                    </div>

                    {isEditing && (
                      <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1.5">Status</label>
                        <select value={form.status} onChange={(e) => set('status', e.target.value as TaskStatus)} className="input-base">
                          {TASK_STATUSES.map((s) => <option key={s} value={s}>{formatCategoryLabel(s)}</option>)}
                        </select>
                      </div>
                    )}
                  </>
                )}

                {/* DETAILS TAB */}
                {activeTab === 'details' && (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1.5">Location</label>
                      <input type="text" value={form.location ?? ''} onChange={(e) => set('location', e.target.value)} placeholder="Room 204, Online, etc." className="input-base" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1.5">Meeting Link</label>
                      <input type="url" value={form.meetingLink ?? ''} onChange={(e) => set('meetingLink', e.target.value)} placeholder="https://meet.google.com/..." className="input-base" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1.5">Website / Registration Link</label>
                      <input type="url" value={form.websiteLink ?? ''} onChange={(e) => set('websiteLink', e.target.value)} placeholder="https://..." className="input-base" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1.5">Notes</label>
                      <textarea value={form.notes ?? ''} onChange={(e) => set('notes', e.target.value)} placeholder="Additional notes..." rows={4} className="input-base resize-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-2">Required Documents</label>
                      <div className="flex flex-wrap gap-2">
                        {REQUIRED_DOCUMENTS.map((doc) => {
                          const selected = (form.requiredDocuments ?? []).includes(doc)
                          return (
                            <button
                              key={doc}
                              type="button"
                              onClick={() => toggleDoc(doc)}
                              className={cn(
                                'text-xs px-2.5 py-1 rounded-full border font-medium transition-all',
                                selected
                                  ? 'bg-accent-violet/20 border-accent-violet text-accent-violet'
                                  : 'border-border text-text-secondary hover:border-border-hover'
                              )}
                            >
                              {doc}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </>
                )}

                {/* REMINDERS TAB */}
                {activeTab === 'reminders' && (
                  <div className="space-y-3">
                    <p className="text-xs text-text-secondary">Reminders fire before the deadline.</p>
                    {(form.reminders ?? []).map((r, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <select
                          value={r.type}
                          onChange={(e) => {
                            const updated = [...(form.reminders ?? [])]
                            updated[i] = {
                              ...updated[i],
                              type: e.target.value as ReminderType,
                              customTime: e.target.value === 'custom' ? updated[i].customTime : undefined,
                            }
                            set('reminders', updated)
                          }}
                          className="input-base flex-1"
                        >
                          {REMINDER_TYPES.map((rt) => (
                            <option key={rt} value={rt}>{
                              { '1w': '1 week before', '3d': '3 days before', '1d': '1 day before',
                                '6h': '6 hours before', '1h': '1 hour before', '30m': '30 min before',
                                '5m': '5 min before', custom: 'Custom time' }[rt]
                            }</option>
                          ))}
                        </select>
                        <button type="button" onClick={() => removeReminder(i)} className="text-text-muted hover:text-accent-danger transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        {r.type === 'custom' && (
                          <input
                            type="datetime-local"
                            value={r.customTime ?? ''}
                            onChange={(e) => {
                              const updated = [...(form.reminders ?? [])]
                              updated[i] = { ...updated[i], customTime: e.target.value }
                              set('reminders', updated)
                            }}
                            className="input-base flex-1"
                          />
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addReminder}
                      className="flex items-center gap-2 text-sm text-accent-violet hover:text-accent-violet/80 font-medium transition-colors"
                    >
                      <Plus className="w-4 h-4" /> Add Reminder
                    </button>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-5 py-4 border-t border-border bg-background-surface">
                <div className="flex gap-2">
                  {TABS.indexOf(activeTab) > 0 && (
                    <button type="button" onClick={() => setActiveTab(TABS[TABS.indexOf(activeTab) - 1])} className="btn-secondary text-sm px-3 py-1.5">
                      Back
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={onClose} className="btn-secondary text-sm px-3 py-1.5">
                    Cancel
                  </button>
                  {TABS.indexOf(activeTab) < TABS.length - 1 ? (
                    <button type="button" onClick={() => setActiveTab(TABS[TABS.indexOf(activeTab) + 1])} className="btn-primary text-sm px-4 py-1.5">
                      Next
                    </button>
                  ) : (
                    <button type="submit" disabled={loading} className="btn-primary text-sm px-4 py-1.5 flex items-center gap-2">
                      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                      {isEditing ? 'Save Changes' : 'Create Task'}
                    </button>
                  )}
                </div>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}