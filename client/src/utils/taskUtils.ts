import { ITask, TaskPriority, TaskStatus, CATEGORY_COLORS, PRIORITY_COLORS, STATUS_COLORS } from '../types'
import { isOverdue } from './formatters'

export function getEffectiveStatus(task: ITask): TaskStatus {
  if (task.status === 'Completed') return 'Completed'
  if (task.status !== 'Missed' && task.deadline && isOverdue(task.deadline)) return 'Missed'
  return task.status
}

export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] ?? '#64748B'
}

export function getPriorityColor(priority: TaskPriority): string {
  return PRIORITY_COLORS[priority]
}

export function getStatusColor(status: TaskStatus): string {
  return STATUS_COLORS[status]
}

export function sortTasksByPriority(tasks: ITask[]): ITask[] {
  const order: Record<TaskPriority, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 }
  return [...tasks].sort((a, b) => (order[b.priority] ?? 0) - (order[a.priority] ?? 0))
}

export function groupTasksByStatus(tasks: ITask[]): Record<TaskStatus, ITask[]> {
  return tasks.reduce(
    (acc, task) => {
      const status = task.status
      if (!acc[status]) acc[status] = []
      acc[status].push(task)
      return acc
    },
    { Pending: [], InProgress: [], Completed: [], Missed: [] } as Record<TaskStatus, ITask[]>
  )
}

export function getCompletionRate(tasks: ITask[]): number {
  if (tasks.length === 0) return 0
  const done = tasks.filter((t) => t.status === 'Completed').length
  return Math.round((done / tasks.length) * 100)
}