import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Loader2, Sparkles, Trash2 } from 'lucide-react'
import { aiService } from '../../services/aiService'
import { useUIStore } from '../../store/uiStore'
import { AIMessage } from '../../types'
import { formatRelative } from '../../utils/formatters'
import { cn } from '../../lib/utils'
import toast from 'react-hot-toast'

const SUGGESTIONS = [
  'What tasks do I have today?',
  'Show overdue tasks',
  'Which tasks have critical priority?',
  'What should I complete first?',
  'Show internship deadlines',
]

export function AIChatPanel() {
  const { setAIPanelOpen } = useUIStore()
  const [messages, setMessages] = useState<AIMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => bottomRef.current?.scrollIntoView({ behavior: 'smooth' })

  useEffect(() => {
    aiService.getConversation()
      .then((r) => setMessages(r.data.messages ?? []))
      .catch(() => {})
      .finally(() => setInitialLoad(false))
  }, [])

  useEffect(() => { scrollToBottom() }, [messages])

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return
    const userMsg: AIMessage = {
      _id: `u-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await aiService.sendMessage(text)
      const assistantMsg: AIMessage = {
        _id: `a-${Date.now()}`,
        role: 'assistant',
        content: res.data.reply,
        timestamp: new Date().toISOString(),
      }
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
    <motion.div
      initial={{ x: 360, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 360, opacity: 0 }}
      transition={{ type: 'spring', damping: 28, stiffness: 280 }}
      className="fixed right-0 top-0 bottom-0 w-[360px] bg-background-surface border-l border-border flex flex-col z-40 shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-violet to-accent-cyan flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">AI Assistant</p>
            <p className="text-xs text-text-muted">Ask anything about your tasks</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button onClick={() => void handleClear()} className="btn-ghost p-2" title="Clear conversation">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button onClick={() => setAIPanelOpen(false)} className="btn-ghost p-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {initialLoad ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-5 h-5 animate-spin text-accent-violet" />
          </div>
        ) : messages.length === 0 ? (
          <div className="space-y-4">
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-xl bg-accent-violet/10 border border-accent-violet/20 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-accent-violet" />
              </div>
              <p className="text-text-primary font-medium text-sm">How can I help?</p>
              <p className="text-text-muted text-xs mt-1">Ask me anything about your tasks and deadlines.</p>
            </div>

            <div className="space-y-2">
              <p className="text-text-muted text-xs font-medium px-1">Try asking:</p>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => void sendMessage(s)}
                  className="w-full text-left text-xs text-text-secondary bg-background-elevated border border-border rounded-lg px-3 py-2.5 hover:border-accent-violet/40 hover:text-text-primary transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg._id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent-violet to-accent-cyan flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                )}
                <div className={cn(
                  'max-w-[80%] rounded-xl px-3 py-2.5 text-sm',
                  msg.role === 'user'
                    ? 'bg-accent-violet text-white rounded-br-sm'
                    : 'bg-background-elevated border border-border text-text-primary rounded-bl-sm'
                )}>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  <p className={cn('text-[10px] mt-1', msg.role === 'user' ? 'text-white/60' : 'text-text-muted')}>
                    {formatRelative(msg.timestamp)}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {loading && (
          <div className="flex justify-start">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent-violet to-accent-cyan flex items-center justify-center mr-2 mt-1">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <div className="bg-background-elevated border border-border rounded-xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-violet animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-accent-violet animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-accent-violet animate-bounce" style={{ animationDelay: '300ms' }} />
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
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void sendMessage(input) } }}
            placeholder="Ask about your tasks..."
            className="input-base flex-1 text-sm"
            disabled={loading}
          />
          <button
            onClick={() => void sendMessage(input)}
            disabled={!input.trim() || loading}
            className="btn-primary px-3 py-2 flex items-center justify-center disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}