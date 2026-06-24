import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Loader2, CheckCircle, Pencil } from 'lucide-react'
import { aiService } from '../../services/aiService'
import { taskService } from '../../services/taskService'
import { CreateTaskPayload } from '../../types'
import { TaskForm } from '../tasks/TaskForm'
import { formatDeadline } from '../../utils/formatters'
import { cn } from '../../lib/utils'
import toast from 'react-hot-toast'

interface Props {
  onClose: () => void
}

type Step = 'input' | 'preview' | 'done'

export function NLTaskCreator({ onClose }: Props) {
  const [step, setStep] = useState<Step>('input')
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [parsed, setParsed] = useState<Partial<CreateTaskPayload> & { confidence?: number } | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [creating, setCreating] = useState(false)

  const EXAMPLES = [
    'HackVega registration ends 25 June 11:59 PM. Need Resume, Aadhaar and GitHub.',
    'Team meeting tomorrow at 3 PM, Google Meet link: meet.google.com/abc-xyz',
    'Submit OS assignment by Friday midnight, critical priority',
    'Oracle campus drive registration closes in 2 days, need resume and transcript',
  ]

  const handleParse = async () => {
    if (!input.trim()) return
    setLoading(true)
    try {
      const res = await aiService.createFromText(input)
      setParsed(res.data as typeof parsed)
      setStep('preview')
    } catch {
      toast.error('Failed to parse. Try rephrasing.')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = async () => {
    if (!parsed) return
    setCreating(true)
    try {
      await taskService.create({
        title: parsed.title ?? 'Untitled Task',
        description: parsed.description,
        category: parsed.category ?? 'Others',
        priority: parsed.priority ?? 'Medium',
        deadline: parsed.deadline,
        deadlineTime: parsed.deadlineTime,
        requiredDocuments: parsed.requiredDocuments ?? [],
        reminders: (parsed.reminders ?? []) as CreateTaskPayload['reminders'],
        notes: parsed.notes,
        source: 'ai',
        recurring: { enabled: false, interval: 1 },
      })
      toast.success('Task created!')
      setStep('done')
    } catch {
      toast.error('Failed to create task')
    } finally {
      setCreating(false)
    }
  }

  if (showForm && parsed) {
    return (
      <TaskForm
        prefill={{
          title: parsed.title,
          description: parsed.description,
          category: parsed.category,
          priority: parsed.priority,
          deadline: parsed.deadline,
          deadlineTime: parsed.deadlineTime,
          requiredDocuments: parsed.requiredDocuments,
          notes: parsed.notes,
          source: 'ai',
        }}
        onClose={() => { setShowForm(false); onClose() }}
      />
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-background-elevated border border-border rounded-xl w-full max-w-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-violet to-accent-cyan flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-text-primary text-sm">AI Task Creator</h2>
              <p className="text-text-muted text-xs">Describe your task in plain English</p>
            </div>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          <AnimatePresence mode="wait">
            {/* INPUT STEP */}
            {step === 'input' && (
              <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && e.ctrlKey) void handleParse() }}
                  placeholder="e.g. HackVega registration ends 25 June 11:59 PM. Need Resume, Aadhaar and GitHub."
                  rows={4}
                  className="input-base resize-none text-sm"
                  autoFocus
                />

                <div>
                  <p className="text-text-muted text-xs mb-2">Try an example:</p>
                  <div className="space-y-1.5">
                    {EXAMPLES.map((ex) => (
                      <button
                        key={ex}
                        onClick={() => setInput(ex)}
                        className="w-full text-left text-xs text-text-secondary bg-background-surface border border-border rounded-lg px-3 py-2 hover:border-accent-violet/40 hover:text-text-primary transition-all truncate"
                      >
                        {ex}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button onClick={onClose} className="btn-secondary text-sm flex-1">Cancel</button>
                  <button
                    onClick={() => void handleParse()}
                    disabled={!input.trim() || loading}
                    className="btn-primary text-sm flex-1 flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    Extract Task
                  </button>
                </div>
              </motion.div>
            )}

            {/* PREVIEW STEP */}
            {step === 'preview' && parsed && (
              <motion.div key="preview" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-text-secondary">Review extracted task:</p>
                  {parsed.confidence !== undefined && (
                    <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full',
                      (parsed.confidence as number) > 0.8
                        ? 'bg-accent-success/10 text-accent-success'
                        : 'bg-accent-warning/10 text-accent-warning')}>
                      {Math.round((parsed.confidence as number) * 100)}% confident
                    </span>
                  )}
                </div>

                <div className="bg-background-surface border border-border rounded-lg p-4 space-y-3">
                  <PreviewRow label="Title" value={parsed.title ?? ''} />
                  <PreviewRow label="Category" value={parsed.category ?? ''} />
                  <PreviewRow label="Priority" value={parsed.priority ?? ''} />
                  {parsed.deadline && <PreviewRow label="Deadline" value={formatDeadline(parsed.deadline)} />}
                  {parsed.deadlineTime && <PreviewRow label="Time" value={parsed.deadlineTime} />}
                  {(parsed.requiredDocuments?.length ?? 0) > 0 && (
                    <PreviewRow label="Documents" value={(parsed.requiredDocuments ?? []).join(', ')} />
                  )}
                  {parsed.notes && <PreviewRow label="Notes" value={parsed.notes} />}
                </div>

                <div className="flex gap-2">
                  <button onClick={() => setStep('input')} className="btn-secondary text-sm px-3 py-2">
                    Back
                  </button>
                  <button onClick={() => setShowForm(true)} className="btn-secondary text-sm flex items-center gap-1.5 px-3 py-2">
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => void handleConfirm()}
                    disabled={creating}
                    className="btn-primary text-sm flex-1 flex items-center justify-center gap-2"
                  >
                    {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    Create Task
                  </button>
                </div>
              </motion.div>
            )}

            {/* DONE STEP */}
            {step === 'done' && (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-10 gap-4">
                <div className="w-14 h-14 rounded-full bg-accent-success/10 border border-accent-success/30 flex items-center justify-center">
                  <CheckCircle className="w-7 h-7 text-accent-success" />
                </div>
                <div className="text-center">
                  <p className="text-text-primary font-semibold">Task Created!</p>
                  <p className="text-text-muted text-xs mt-1">{parsed?.title}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setStep('input'); setInput(''); setParsed(null) }} className="btn-secondary text-sm px-4">
                    Add Another
                  </button>
                  <button onClick={onClose} className="btn-primary text-sm px-4">Done</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-xs text-text-muted w-20 flex-shrink-0 pt-0.5">{label}</span>
      <span className="text-xs text-text-primary font-medium">{value}</span>
    </div>
  )
}