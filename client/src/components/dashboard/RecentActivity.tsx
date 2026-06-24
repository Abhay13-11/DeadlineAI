import { ActivityItem } from '../../types'
import { formatRelative } from '../../utils/formatters'

import { TaskCategoryBadge } from '../tasks/TaskCategoryBadge'

const ACTION_LABELS: Record<string, string> = {
  task_created:   'Created',
  task_updated:   'Updated',
  status_changed: 'Status changed',
  task_completed: 'Completed',
  task_missed:    'Missed',
  task_deleted:   'Deleted',
  reminder_sent:  'Reminder sent',
}

interface Props { activities: ActivityItem[] }

export function RecentActivity({ activities }: Props) {
  if (activities.length === 0) {
    return <p className="text-text-muted text-sm py-4 text-center">No recent activity</p>
  }

  return (
    <div className="space-y-0">
      {activities.slice(0, 10).map((item, i) => (
        <div key={item._id ?? i} className="flex items-start gap-3 py-2.5 border-b border-border/50 last:border-0">
          <div className="w-1.5 h-1.5 rounded-full bg-accent-violet mt-2 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-text-primary">
              <span className="text-text-secondary">{ACTION_LABELS[item.action] ?? item.action}: </span>
              {item.taskId?.title ?? 'Unknown task'}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              {item.taskId?.category && (
                <TaskCategoryBadge category={item.taskId.category} showIcon={false} />
              )}
              <span className="text-text-muted text-xs">{formatRelative(item.timestamp)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}