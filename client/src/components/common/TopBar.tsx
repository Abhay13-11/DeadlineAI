import { Menu, Plus, Search, Bell, Upload, Sparkles } from 'lucide-react'
import { useUIStore } from '../../store/uiStore'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OCRUploader } from '../ai/OCRUploader'
import { NLTaskCreator } from '../ai/NLTaskCreator'
import { AnimatePresence } from 'framer-motion'

export function TopBar() {
  const { toggleSidebar, openTaskForm, toggleAIPanel } = useUIStore()
  const [search, setSearch] = useState('')
  const [showOCR, setShowOCR] = useState(false)
  const [showNL, setShowNL] = useState(false)
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      void navigate(`/tasks?search=${encodeURIComponent(search)}`)
    }
  }

  return (
    <>
      <header className="sticky top-0 z-30 h-14 bg-background-surface/80 backdrop-blur-md border-b border-border flex items-center gap-3 px-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden btn-ghost p-2"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="input-base pl-9 h-9 text-sm"
            />
          </div>
        </form>

        <div className="flex items-center gap-1.5 ml-auto">
          {/* AI Chat */}
          <button
            onClick={toggleAIPanel}
            className="btn-ghost text-text-secondary hover:text-accent-violet px-2.5 py-2 text-sm flex items-center gap-1.5"
            title="AI Assistant"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline text-xs font-medium">AI</span>
          </button>

          {/* OCR Upload */}
          <button
            onClick={() => setShowOCR(true)}
            className="btn-ghost text-text-secondary hover:text-accent-cyan px-2.5 py-2"
            title="Extract tasks from screenshot or PDF"
          >
            <Upload className="w-4 h-4" />
          </button>

          {/* Notification bell */}
          <button className="btn-ghost relative p-2" title="Notifications">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-accent-danger rounded-full" />
          </button>

          {/* New task dropdown */}
          <div className="relative group">
            <button
              onClick={() => openTaskForm()}
              className="btn-primary flex items-center gap-2 text-sm px-3 py-1.5"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Task</span>
            </button>
            {/* Secondary options on hover */}
            <div className="absolute right-0 top-full mt-1 w-48 bg-background-elevated border border-border rounded-lg shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <button
                onClick={() => openTaskForm()}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-text-secondary hover:text-text-primary hover:bg-border/30"
              >
                <Plus className="w-3.5 h-3.5" /> Manual Task
              </button>
              <button
                onClick={() => setShowNL(true)}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-text-secondary hover:text-text-primary hover:bg-border/30"
              >
                <Sparkles className="w-3.5 h-3.5" /> AI from Text
              </button>
              <button
                onClick={() => setShowOCR(true)}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-text-secondary hover:text-text-primary hover:bg-border/30"
              >
                <Upload className="w-3.5 h-3.5" /> From Screenshot / PDF
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {showOCR && <OCRUploader onClose={() => setShowOCR(false)} />}
        {showNL && <NLTaskCreator onClose={() => setShowNL(false)} />}
      </AnimatePresence>
    </>
  )
}