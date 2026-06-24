import { TaskPriority } from '../../types'
import { cn } from '../../lib/utils'

const CONFIG: Record<TaskPriority, { label: string; classes: string; dot: string }> = {
  Low:      { label: 'Low',      classes: 'text-[#64748B]', dot: 'bg-[#64748B]' },
  Medium:   { label: 'Medium',   classes: 'text-[#3B82F6]', dot: 'bg-[#3B82F6]' },
  High:     { label: 'High',     classes: 'text-[#F59E0B]', dot: 'bg-[#F59E0B]' },
  Critical: { label: 'Critical', classes: 'text-[#EF4444]', dot: 'bg-[#EF4444]' },
}

interface Props {
  priority: TaskPriority
  showDot?: boolean
}

export function TaskPriorityBadge({ priority, showDot = true }: Props) {
  const { label, classes, dot } = CONFIG[priority]
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium', classes)}>
      {showDot && (
        <span className={cn(
          'w-1.5 h-1.5 rounded-full flex-shrink-0',
          dot,
          priority === 'Critical' && 'pulse-critical'
        )} />
      )}
      {label}
    </span>
  )
}