import { TaskStatus } from '../../types'
import { cn } from '../../lib/utils'

const CONFIG: Record<TaskStatus, { label: string; classes: string }> = {
  Pending:    { label: 'Pending',     classes: 'bg-[#8B8BA7]/10 text-[#8B8BA7] border-[#8B8BA7]/20' },
  InProgress: { label: 'In Progress', classes: 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20' },
  Completed:  { label: 'Completed',   classes: 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20' },
  Missed:     { label: 'Missed',      classes: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20' },
}

interface Props {
  status: TaskStatus
  size?: 'sm' | 'md'
}

export function TaskStatusBadge({ status, size = 'sm' }: Props) {
  const { label, classes } = CONFIG[status]
  return (
    <span className={cn(
      'inline-flex items-center border rounded-full font-medium',
      size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1',
      classes
    )}>
      {label}
    </span>
  )
}