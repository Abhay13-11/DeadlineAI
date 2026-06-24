import { format, formatDistanceToNow, isToday, isTomorrow, isPast, parseISO } from 'date-fns'

export function formatDeadline(deadline?: string): string {
  if (!deadline) return 'No deadline'
  const date = parseISO(deadline)
  if (isToday(date)) return 'Today'
  if (isTomorrow(date)) return 'Tomorrow'
  return format(date, 'MMM d, yyyy')
}

export function formatDeadlineFull(deadline?: string, time?: string): string {
  if (!deadline) return 'No deadline'
  const date = parseISO(deadline)
  const dateStr = format(date, 'EEE, MMM d yyyy')
  return time ? `${dateStr} at ${time}` : dateStr
}

export function formatRelative(dateStr: string): string {
  return formatDistanceToNow(parseISO(dateStr), { addSuffix: true })
}

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), 'MMM d, yyyy')
}

export function formatTime(dateStr: string): string {
  return format(parseISO(dateStr), 'h:mm a')
}

export function isOverdue(deadline?: string): boolean {
  if (!deadline) return false
  return isPast(parseISO(deadline))
}

export function getDaysUntil(deadline?: string): number | null {
  if (!deadline) return null
  const diff = parseISO(deadline).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function formatCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    CodingContest: 'Coding Contest',
    JobApplication: 'Job Application',
    InProgress: 'In Progress',
  }
  return labels[category] ?? category
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}