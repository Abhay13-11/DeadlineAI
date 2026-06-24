import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, Loader2 } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import { useTasks } from '../../hooks/useTasks'
import { useUIStore } from '../../store/uiStore'
import { useDebounce } from '../../hooks/useDebounce'
import { TaskCard } from '../../components/tasks/TaskCard'
import { TaskFilters, FilterState } from '../../components/tasks/TaskFilters'
import { PageHeader } from '../../components/common/PageHeader'
import { EmptyState } from '../../components/common/EmptyState'
import { CheckSquare } from 'lucide-react'

const DEFAULT_FILTERS: FilterState = { sort: 'deadline', order: 'asc' }

export function TasksPage() {
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') ?? '')
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebounce(search, 400)

  const { tasks, isLoading, totalTasks, totalPages, fetchTasks } = useTasks()
  const { openTaskForm } = useUIStore()

  const load = useCallback(() => {
    void fetchTasks({
      ...filters,
      search: debouncedSearch || undefined,
      page,
      limit: 20,
    })
  }, [fetchTasks, filters, debouncedSearch, page])

  useEffect(() => { load() }, [load])

  const handleFilterChange = (f: FilterState) => {
    setFilters(f)
    setPage(1)
  }

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS)
    setSearch('')
    setPage(1)
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Tasks"
        description={`${totalTasks} task${totalTasks !== 1 ? 's' : ''} total`}
        actions={
          <button onClick={() => openTaskForm()} className="btn-primary flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> New Task
          </button>
        }
      />

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1) }}
        placeholder="Search tasks by title, description, or notes..."
        className="input-base"
      />

      <TaskFilters filters={filters} onChange={handleFilterChange} onClear={clearFilters} />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-accent-violet" />
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No tasks found"
          description="Try adjusting your filters or create a new task."
          action={{ label: 'Create Task', onClick: () => openTaskForm() }}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            <AnimatePresence mode="popLayout">
              {tasks.map((task) => <TaskCard key={task._id} task={task} />)}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="btn-secondary text-sm px-3 py-1.5 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-text-secondary text-sm">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="btn-secondary text-sm px-3 py-1.5 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}