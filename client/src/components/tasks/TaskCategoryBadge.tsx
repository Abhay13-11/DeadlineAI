import { TaskCategory, CATEGORY_COLORS } from '../../types'
import { formatCategoryLabel } from '../../utils/formatters'

const CATEGORY_ICONS: Record<TaskCategory, string> = {
  Internship:     '💼',
  Hackathon:      '⚡',
  Assignment:     '📝',
  Meeting:        '🗓️',
  Interview:      '🎯',
  CodingContest:  '💻',
  Certification:  '🏆',
  Exam:           '📖',
  College:        '🎓',
  Personal:       '✨',
  JobApplication: '📨',
  Others:         '📌',
}

interface Props {
  category: TaskCategory
  showIcon?: boolean
}

export function TaskCategoryBadge({ category, showIcon = true }: Props) {
  const color = CATEGORY_COLORS[category]
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border"
      style={{
        color,
        backgroundColor: `${color}15`,
        borderColor: `${color}30`,
      }}
    >
      {showIcon && <span className="text-[11px]">{CATEGORY_ICONS[category]}</span>}
      {formatCategoryLabel(category)}
    </span>
  )
}