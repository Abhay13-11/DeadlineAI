import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import { aiService } from '../../services/aiService'
import toast from 'react-hot-toast'

export function DailyPlanWidget() {
  const [plan, setPlan] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(true)

  const generate = async () => {
    setLoading(true)
    try {
      const res = await aiService.suggestPlan()
      setPlan(res.data.plan)
      setExpanded(true)
    } catch {
      toast.error('Could not generate plan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-background-surface border border-border rounded-lg p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent-violet" />
          <h3 className="text-sm font-semibold text-text-primary">AI Daily Plan</h3>
        </div>
        <div className="flex items-center gap-1">
          {plan && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="btn-ghost p-1.5"
            >
              {expanded
                ? <ChevronUp className="w-4 h-4" />
                : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
          <button
            onClick={() => void generate()}
            disabled={loading}
            className="btn-secondary text-xs px-2.5 py-1.5 flex items-center gap-1.5"
          >
            {loading
              ? <Loader2 className="w-3 h-3 animate-spin" />
              : <Sparkles className="w-3 h-3" />}
            {plan ? 'Regenerate' : 'Generate Plan'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {plan && expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="text-sm text-text-secondary whitespace-pre-wrap leading-relaxed border-t border-border pt-3">
              {plan}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!plan && !loading && (
        <p className="text-xs text-text-muted">
          Click "Generate Plan" to get an AI-powered plan for today based on your tasks.
        </p>
      )}
    </motion.div>
  )
}