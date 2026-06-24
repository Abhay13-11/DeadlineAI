import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Loader2, Sparkles, Trash2 } from 'lucide-react'
import { aiService } from '../../services/aiService'
import { AIMessage } from '../../types'
import { formatRelative } from '../../utils/formatters'
import { PageHeader } from '../../components/common/PageHeader'
import { cn } from '../../lib/utils'
import toast from 'react-hot-toast'

const SUGGESTIONS = [
  'What tasks do I have today?',
  'Show overdue tasks',
  'Which tasks need my Resume?',
  'What should I complete first?',
  'Show internship deadlines',
  'Generate today\'s plan',
]

export function AIAssistantPage() {
  const [messages, setMessages] = useState<AIMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    aiService.getConversation()
      .then((r) => setMessages(r.data.messages ?? []))
      .catch(() => {})
      .finally(() => setInitialLoad(false))
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return
    const userMsg: AIMessage = { _id: `u-${Date.now()}`, role: 'user', content: text, timestamp: new Date().toISOString() }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setLoading(true)
    try {
      const res = await aiService.sendMessage(text)
      const assistantMsg: AIMessage = { _id: `a-${Date.now()}`, role: 'assistant', content: res.data.reply, timestamp: new Date().toISOString() }
      setMessages((m) => [...m, assistantMsg])
    } catch {
      toast.error('AI is unavailable right now')
      setMessages((m) => m.filter((msg) => msg._id !== userMsg._id))
    } finally {
      setLoading(false)
    }
  }, [loading])

  const handleClear = async () => {
    await aiService.clearConversation().catch(() => {})
    setMessages([])
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <PageHeader
        title="AI Assistant"
        description="Ask anything about your tasks, deadlines, or let AI create tasks for you."
        actions={
          messages.length > 0 ? (
            <button onClick={() => void handleClear()} className="btn-secondary flex items-center gap-2 text-sm">
              <Trash2 className="w-4 h-4" /> Clear
            </button>
          ) : undefined
        }
      />

      <div className="bg-background-surface border border-border rounded-xl overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 200px)' }}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {initialLoad ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-5 h-5 animate-spin text-accent-violet" />
            </div>
          ) : messages.length === 0 ? (
            <div className="space-y-5">
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-violet to-accent-cyan flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-text-primary font-semibold text-base">Your AI Task Assistant</h2>
                <p className="text-text-secondary text-sm mt-1 max-w-sm mx-auto">
                  Ask me about your tasks, deadlines, or say something like "Add meeting tomorrow at 4 PM."
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => void sendMessage(s)}
                    className="text-left text-xs text-text-secondary bg-background-elevated border border-border rounded-lg px-3 py-3 hover:border-accent-violet/40 hover:text-text-primary transition-all">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div key={msg._id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-violet to-accent-cyan flex items-center justify-center mr-2.5 mt-1 flex-shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  <div className={cn('max-w-[78%] rounded-2xl px-4 py-3 text-sm',
                    msg.role === 'user'
                      ? 'bg-accent-violet text-white rounded-br-sm'
                      : 'bg-background-elevated border border-border text-text-primary rounded-bl-sm')}>
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    <p className={cn('text-[10px] mt-1.5', msg.role === 'user' ? 'text-white/60' : 'text-text-muted')}>
                      {formatRelative(msg.timestamp)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          {loading && (
            <div className="flex justify-start">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-violet to-accent-cyan flex items-center justify-center mr-2.5 mt-1">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="bg-background-elevated border border-border rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex gap-1 items-center h-4">
                  {[0, 150, 300].map((d) => (
                    <span key={d} className="w-1.5 h-1.5 rounded-full bg-accent-violet animate-bounce" style={{ animationDelay: `${d}ms` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <input
              type="text" value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void sendMessage(input) } }}
              placeholder="Ask about your tasks, or describe a new task to add..."
              className="input-base flex-1"
              disabled={loading}
            />
            <button onClick={() => void sendMessage(input)} disabled={!input.trim() || loading}
              className="btn-primary px-4 flex items-center justify-center disabled:opacity-40">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}