import { TaskCategory, TaskPriority, TaskStatus, TASK_CATEGORIES, TASK_PRIORITIES, TASK_STATUSES } from '../../types'
import { formatCategoryLabel } from '../../utils/formatters'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface FilterState {
  category?: TaskCategory
  priority?: TaskPriority
  status?: TaskStatus
  filter?: string
  sort: string
  order: 'asc' | 'desc'
}

const QUICK_FILTERS = [
  { key: 'today',        label: 'Today' },
  { key: 'tomorrow',     label: 'Tomorrow' },
  { key: 'this_week',    label: 'This Week' },
  { key: 'overdue',      label: 'Overdue' },
  { key: 'high_priority',label: 'High Priority' },
]

interface Props {
  filters: FilterState
  onChange: (f: FilterState) => void
  onClear: () => void
}

export function TaskFilters({ filters, onChange, onClear }: Props) {
  const hasActive = !!(filters.category || filters.priority || filters.status || filters.filter)

  return (
    <div className="space-y-3">
      {/* Quick filters */}
      <div className="flex flex-wrap gap-2">
        {QUICK_FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onChange({ ...filters, filter: filters.filter === key ? undefined : key })}
            className={cn(
              'text-xs px-3 py-1.5 rounded-full border font-medium transition-all',
              filters.filter === key
                ? 'bg-accent-violet border-accent-violet text-white'
                : 'border-border text-text-secondary hover:border-border-hover hover:text-text-primary'
            )}
          >
            {label}
          </button>
        ))}

        {hasActive && (
          <button
            onClick={onClear}
            className="text-xs px-3 py-1.5 rounded-full border border-border text-accent-danger hover:bg-accent-danger/5 font-medium flex items-center gap-1 transition-all"
          >
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      {/* Dropdowns row */}
      <div className="flex flex-wrap gap-2">
        <select
          value={filters.category ?? ''}
          onChange={(e) => onChange({ ...filters, category: (e.target.value as TaskCategory) || undefined })}
          className="input-base w-auto text-xs py-1.5 pr-8"
        >
          <option value="">All Categories</option>
          {TASK_CATEGORIES.map((c) => (
            <option key={c} value={c}>{formatCategoryLabel(c)}</option>
          ))}
        </select>

        <select
          value={filters.priority ?? ''}
          onChange={(e) => onChange({ ...filters, priority: (e.target.value as TaskPriority) || undefined })}
          className="input-base w-auto text-xs py-1.5 pr-8"
        >
          <option value="">All Priorities</option>
          {TASK_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>

        <select
          value={filters.status ?? ''}
          onChange={(e) => onChange({ ...filters, status: (e.target.value as TaskStatus) || undefined })}
          className="input-base w-auto text-xs py-1.5 pr-8"
        >
          <option value="">All Statuses</option>
          {TASK_STATUSES.map((s) => <option key={s} value={s}>{formatCategoryLabel(s)}</option>)}
        </select>

        <select
          value={`${filters.sort}-${filters.order}`}
          onChange={(e) => {
            const [sort, order] = e.target.value.split('-')
            onChange({ ...filters, sort, order: order as 'asc' | 'desc' })
          }}
          className="input-base w-auto text-xs py-1.5 pr-8"
        >
          <option value="deadline-asc">Deadline ↑</option>
          <option value="deadline-desc">Deadline ↓</option>
          <option value="priority-desc">Priority ↓</option>
          <option value="createdAt-desc">Newest</option>
          <option value="title-asc">Title A-Z</option>
        </select>
      </div>
    </div>
  )
}