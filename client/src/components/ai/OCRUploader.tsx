import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import {  X, FileText, Image, Loader2, CheckCircle, Plus } from 'lucide-react'
import { aiService } from '../../services/aiService'
import { CreateTaskPayload } from '../../types'
import { TaskForm } from '../tasks/TaskForm'
import { cn } from '../../lib/utils'
import toast from 'react-hot-toast'
import { useTasks } from '../../hooks/useTasks'

type Mode = 'idle' | 'uploading' | 'reviewing' | 'done'

interface ExtractedTask {
  title: string
  category: string
  priority: string
  deadline?: string
  deadlineTime?: string
  requiredDocuments: string[]
  notes?: string
  confidence: number
  selected: boolean
}

interface Props {
  onClose: () => void
}

export function OCRUploader({ onClose }: Props) {
  const [mode, setMode] = useState<Mode>('idle')
  const [dragOver, setDragOver] = useState(false)
  const [, setExtractedText] = useState('')
  const [tasks, setTasks] = useState<ExtractedTask[]>([])
  const [prefillTask, setPrefillTask] = useState<Partial<CreateTaskPayload> | null>(null)
  const [saving, setSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { createTask } = useTasks()

  const processFile = async (file: File) => {
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) { toast.error('File too large (max 10MB)'); return }

    const isPDF = file.type === 'application/pdf'
    const isImage = file.type.startsWith('image/')
    if (!isPDF && !isImage) { toast.error('Only images and PDFs are supported'); return }

    setMode('uploading')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = isPDF
        ? await aiService.createFromPDF(formData)
        : await aiService.createFromImage(formData)

      setExtractedText(res.data.extractedText ?? '')
      setTasks(
  ((res.data.tasks ?? []) as ExtractedTask[]).map((t) => ({
    ...t,
    selected: true,
  }))
)
      setMode('reviewing')
    } catch {
      toast.error('Failed to extract tasks from file')
      setMode('idle')
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) void processFile(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) void processFile(file)
  }

  const toggleSelect = (i: number) => {
    setTasks((prev) => prev.map((t, idx) => idx === i ? { ...t, selected: !t.selected } : t))
  }

  const confirmSelected = async () => {
    const selected = tasks.filter((t) => t.selected)
    if (selected.length === 0) { toast.error('Select at least one task'); return }
    setSaving(true)
    try {
      await Promise.all(selected.map((t) =>
        createTask({
          title: t.title,
          category: t.category as CreateTaskPayload['category'],
          priority: t.priority as CreateTaskPayload['priority'],
          deadline: t.deadline,
          deadlineTime: t.deadlineTime,
          requiredDocuments: t.requiredDocuments,
          notes: t.notes,
          source: 'ocr',
          reminders: t.deadline ? [{ type: '1d' as never }, { type: '1h' as never }] : [],
          recurring: { enabled: false, interval: 1 },
        }, { silent: true })
      ))
      toast.success(`Created ${selected.length} task(s)!`)
      setMode('done')
    } catch {
      toast.error('Failed to create tasks')
    } finally {
      setSaving(false)
    }
  }

  if (prefillTask) {
    return (
      <TaskForm
        prefill={prefillTask}
        onClose={() => setPrefillTask(null)}
      />
    )
  }

  return (
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
        className="relative bg-background-elevated border border-border rounded-xl w-full max-w-lg shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h2 className="font-display font-semibold text-text-primary">Extract Tasks</h2>
            <p className="text-text-muted text-xs mt-0.5">Upload a screenshot or PDF to auto-create tasks</p>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          {/* IDLE */}
          {mode === 'idle' && (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={cn(
                'border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all',
                dragOver
                  ? 'border-accent-violet bg-accent-violet/5'
                  : 'border-border hover:border-border-hover hover:bg-background-surface'
              )}
            >
              <div className="flex justify-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-accent-violet/10 flex items-center justify-center">
                  <Image className="w-5 h-5 text-accent-violet" />
                </div>
                <div className="w-10 h-10 rounded-lg bg-accent-cyan/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-accent-cyan" />
                </div>
              </div>
              <p className="text-text-primary font-medium text-sm">Drop your screenshot or PDF here</p>
              <p className="text-text-muted text-xs mt-1">or click to browse — JPG, PNG, WebP, PDF up to 10MB</p>
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          )}

          {/* UPLOADING */}
          {mode === 'uploading' && (
            <div className="flex flex-col items-center justify-center py-14 gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-full border-2 border-border" />
                <div className="absolute inset-0 rounded-full border-2 border-t-accent-violet animate-spin" />
              </div>
              <div className="text-center">
                <p className="text-text-primary font-medium text-sm">Extracting tasks...</p>
                <p className="text-text-muted text-xs mt-1">AI is reading your file</p>
              </div>
            </div>
          )}

          {/* REVIEWING */}
          {mode === 'reviewing' && (
            <div className="space-y-4">
              {tasks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-text-secondary text-sm">No tasks could be extracted.</p>
                  <p className="text-text-muted text-xs mt-1">Try a clearer image or add the task manually.</p>
                </div>
              ) : (
                <>
                  <p className="text-text-secondary text-xs">
                    Found <span className="text-text-primary font-medium">{tasks.length}</span> task(s). Select which to create:
                  </p>
                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {tasks.map((task, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => toggleSelect(i)}
                        className={cn(
                          'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all',
                          task.selected
                            ? 'border-accent-violet/50 bg-accent-violet/5'
                            : 'border-border hover:border-border-hover'
                        )}
                      >
                        <div className={cn(
                          'mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0',
                          task.selected ? 'bg-accent-violet border-accent-violet' : 'border-border'
                        )}>
                          {task.selected && <CheckCircle className="w-3 h-3 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary">{task.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-text-muted">{task.category}</span>
                            <span className="text-xs text-text-muted">·</span>
                            <span className="text-xs text-text-muted">{task.priority}</span>
                            {task.deadline && (
                              <>
                                <span className="text-xs text-text-muted">·</span>
                                <span className="text-xs text-accent-warning">
                                  {new Date(task.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                </span>
                              </>
                            )}
                          </div>
                          {task.requiredDocuments?.length > 0 && (
                            <p className="text-xs text-text-muted mt-0.5">
                              Docs: {task.requiredDocuments.join(', ')}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setPrefillTask({
                              title: task.title,
                              category: task.category as never,
                              priority: task.priority as never,
                              deadline: task.deadline,
                              deadlineTime: task.deadlineTime,
                              requiredDocuments: task.requiredDocuments,
                              notes: task.notes,
                              source: 'ocr',
                            })
                          }}
                          className="text-text-muted hover:text-accent-violet transition-colors flex-shrink-0"
                          title="Edit before creating"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}

              <div className="flex gap-2 pt-2">
                <button onClick={() => setMode('idle')} className="btn-secondary text-sm flex-1">
                  Try Another File
                </button>
                {tasks.length > 0 && (
                  <button
                    onClick={() => void confirmSelected()}
                    disabled={saving || tasks.filter((t) => t.selected).length === 0}
                    className="btn-primary text-sm flex-1 flex items-center justify-center gap-2"
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    Create {tasks.filter((t) => t.selected).length} Task(s)
                  </button>
                )}
              </div>
            </div>
          )}

          {/* DONE */}
          {mode === 'done' && (
            <div className="flex flex-col items-center justify-center py-10 gap-4">
              <div className="w-14 h-14 rounded-full bg-accent-success/10 border border-accent-success/30 flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-accent-success" />
              </div>
              <div className="text-center">
                <p className="text-text-primary font-semibold">Tasks Created!</p>
                <p className="text-text-muted text-xs mt-1">Check your task list to review them.</p>
              </div>
              <button onClick={onClose} className="btn-primary text-sm px-6">Done</button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}