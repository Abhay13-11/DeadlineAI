import { Menu, Plus, Search, Bell } from 'lucide-react'
import { useUIStore } from '../../store/uiStore'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function TopBar() {
  const { toggleSidebar, openTaskForm, toggleAIPanel } = useUIStore()
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      void navigate(`/tasks?search=${encodeURIComponent(search)}`)
    }
  }

  return (
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

      <div className="flex items-center gap-2 ml-auto">
        {/* AI button */}
        <button
          onClick={toggleAIPanel}
          className="btn-ghost text-text-secondary hover:text-accent-violet px-3 py-2 text-sm flex items-center gap-2"
        >
          <span className="text-base">✨</span>
          <span className="hidden sm:inline">AI</span>
        </button>

        {/* Notification bell */}
        <button className="btn-ghost relative p-2">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-danger rounded-full" />
        </button>

        {/* New task */}
        <button
          onClick={() => openTaskForm()}
          className="btn-primary flex items-center gap-2 text-sm px-3 py-1.5"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Task</span>
        </button>
      </div>
    </header>
  )
}