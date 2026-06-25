import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, TrendingUp, TrendingDown } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend,
} from 'recharts'
import { analyticsService } from '../../services/analyticsService'
import { PageHeader } from '../../components/common/PageHeader'
import { CATEGORY_COLORS, TaskCategory } from '../../types'
import { cn } from '../../lib/utils'

interface OverviewData {
  summary: {
    total: number; completed: number; missed: number
    pending: number; inProgress: number
    completionRate: number; missedRate: number
  }
  categoryBreakdown: { _id: string; count: number; completed: number }[]
  priorityBreakdown: { _id: string; count: number }[]
  completionTrend: { _id: string; count: number }[]
}

interface WeeklyData {
  thisWeek: { total: number; completed: number; completionRate: number }
  lastWeek: { total: number; completed: number; completionRate: number }
  dailyBreakdown: { day: string; date: string; total: number; completed: number }[]
}

const PRIORITY_COLORS: Record<string, string> = {
  Critical: '#EF4444', High: '#F59E0B', Medium: '#3B82F6', Low: '#64748B',
}

export function AnalyticsPage() {
  const [overview, setOverview] = useState<OverviewData | null>(null)
  const [weekly, setWeekly] = useState<WeeklyData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([analyticsService.getOverview(), analyticsService.getWeekly()])
      .then(([ov, wk]) => {
        setOverview(ov.data as OverviewData)
        setWeekly(wk.data as WeeklyData)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-6 h-6 animate-spin text-accent-violet" />
      </div>
    )
  }

  const s = overview?.summary
  const weekDiff = (weekly?.thisWeek.completionRate ?? 0) - (weekly?.lastWeek.completionRate ?? 0)

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Track your productivity and task completion." />

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Tasks',      value: s?.total ?? 0,           color: '#7C6AF7' },
          { label: 'Completed',        value: s?.completed ?? 0,       color: '#22C55E' },
          { label: 'Missed',           value: s?.missed ?? 0,          color: '#EF4444' },
          { label: 'Completion Rate',  value: `${s?.completionRate ?? 0}%`, color: '#06B6D4' },
        ].map(({ label, value, color }) => (
          <motion.div key={label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className="bg-background-surface border border-border rounded-lg p-4">
            <p className="text-text-secondary text-xs mb-1">{label}</p>
            <p className="text-2xl font-bold font-display" style={{ color }}>{value}</p>
          </motion.div>
        ))}
      </div>

      {/* Weekly comparison */}
      {weekly && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          className="bg-background-surface border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text-primary">This Week vs Last Week</h3>
            <div className={cn('flex items-center gap-1 text-xs font-medium',
              weekDiff >= 0 ? 'text-accent-success' : 'text-accent-danger')}>
              {weekDiff >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {weekDiff >= 0 ? '+' : ''}{weekDiff}%
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weekly.dailyBreakdown} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: 'rgb(var(--text-secondary))', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgb(var(--text-secondary))', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'rgb(var(--bg-elevated))', border: '1px solid rgb(var(--border))', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: 'rgb(var(--text-primary))' }}
              />
              <Bar dataKey="total" name="Total" fill="rgb(var(--border))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completed" name="Completed" fill="#7C6AF7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Category breakdown */}
        {overview && overview.categoryBreakdown.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className="bg-background-surface border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-4">By Category</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={overview.categoryBreakdown} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={80} paddingAngle={2}>
                  {overview.categoryBreakdown.map((entry) => (
                    <Cell key={entry._id} fill={CATEGORY_COLORS[entry._id as TaskCategory] ?? '#64748B'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'rgb(var(--bg-elevated))', border: '1px solid rgb(var(--border))', borderRadius: 8, fontSize: 12 }}
                />
                <Legend wrapperStyle={{ fontSize: 11, color: 'rgb(var(--text-secondary))' }} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Priority breakdown */}
        {overview && overview.priorityBreakdown.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className="bg-background-surface border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-4">By Priority</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={overview.priorityBreakdown} layout="vertical">
                <XAxis type="number" tick={{ fill: 'rgb(var(--text-secondary))', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="_id" tick={{ fill: 'rgb(var(--text-secondary))', fontSize: 11 }} axisLine={false} tickLine={false} width={60} />
                <Tooltip
                  contentStyle={{ background: 'rgb(var(--bg-elevated))', border: '1px solid rgb(var(--border))', borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="count" name="Tasks" radius={[0, 4, 4, 0]}>
                  {overview.priorityBreakdown.map((entry) => (
                    <Cell key={entry._id} fill={PRIORITY_COLORS[entry._id] ?? '#64748B'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Completion trend */}
        {overview && overview.completionTrend.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-background-surface border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-4">Completion Trend (Last 4 Weeks)</h3>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={overview.completionTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" vertical={false} />
                <XAxis dataKey="_id" tick={{ fill: 'rgb(var(--text-secondary))', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgb(var(--text-secondary))', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: 'rgb(var(--bg-elevated))', border: '1px solid rgb(var(--border))', borderRadius: 8, fontSize: 12 }}
                />
                <Line type="monotone" dataKey="count" stroke="#7C6AF7" strokeWidth={2} dot={{ fill: '#7C6AF7', r: 4 }} name="Completed" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </div>
    </div>
  )
}
