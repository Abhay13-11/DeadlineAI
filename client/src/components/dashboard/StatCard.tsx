import { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

interface Props {
  label: string
  value: number | string
  icon: LucideIcon
  color: string
  suffix?: string
  trend?: { value: number; label: string }
}

export function StatCard({ label, value, icon: Icon, color, suffix, trend }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-background-surface border border-border rounded-lg p-4 hover:border-border-hover transition-all"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-text-secondary text-sm font-medium">{label}</span>
        <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold font-display text-text-primary">{value}</span>
        {suffix && <span className="text-text-secondary text-sm mb-0.5">{suffix}</span>}
      </div>
      {trend && (
        <p className={cn('text-xs mt-1', trend.value >= 0 ? 'text-accent-success' : 'text-accent-danger')}>
          {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
        </p>
      )}
    </motion.div>
  )
}