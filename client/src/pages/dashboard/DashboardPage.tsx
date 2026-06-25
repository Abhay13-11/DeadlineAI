import { useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  CheckSquare, Clock, AlertTriangle, TrendingUp, Plus,
} from 'lucide-react'
import { useTasks } from '../../hooks/useTasks'
import { useUIStore } from '../../store/uiStore'
import { useNotifications } from '../../hooks/useNotifications'
import { StatCard } from '../../components/dashboard/StatCard'
import { ProductivityScore } from '../../components/dashboard/ProductivityScore'
import { RecentActivity } from '../../components/dashboard/RecentActivity'
import { DailyPlanWidget } from '../../components/dashboard/DailyPlanWidget'
import { TaskCard } from '../../components/tasks/TaskCard'
import { PageHeader } from '../../components/common/PageHeader'
import { EmptyState } from '../../components/common/EmptyState'
import { useAuth } from '../../hooks/useAuth'


export function DashboardPage() {
  const { dashboard, fetchDashboard } = useTasks()
  const { openTaskForm } = useUIStore()
  const { user } = useAuth()
  useNotifications() // Auto-subscribes to web push on mount

  useEffect(() => {
    void fetchDashboard().catch(() => undefined)
  }, [fetchDashboard])

  const stats = dashboard?.stats
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${greeting}, ${user?.name?.split(' ')[0] ?? 'there'} 👋`}
        description="Here's what needs your attention today."
        actions={
          <button onClick={() => openTaskForm()} className="btn-primary flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> New Task
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total Tasks"   value={stats?.total ?? 0}                         icon={CheckSquare}   color="#7C6AF7" />
        <StatCard label="Completed"     value={stats?.completed ?? 0}                     icon={TrendingUp}    color="#22C55E" />
        <StatCard label="Pending"       value={stats?.pending ?? 0}                       icon={Clock}         color="#3B82F6" />
        <StatCard label="Overdue"       value={dashboard?.overdueTasks?.length ?? 0}      icon={AlertTriangle} color="#EF4444" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: task lists */}
        <div className="lg:col-span-2 space-y-4">
          <Section title="Today" count={dashboard?.todayTasks?.length}>
            {dashboard?.todayTasks?.length ? (
              dashboard.todayTasks.map((t) => <TaskCard key={t._id} task={t} compact />)
            ) : (
              <EmptyState
                icon={CheckSquare}
                title="All clear today"
                description="No tasks due today. Enjoy your day or add something new!"
                action={{ label: 'Add Task', onClick: () => openTaskForm() }}
              />
            )}
          </Section>

          <Section title="Upcoming (7 days)" count={dashboard?.upcomingTasks?.length}>
            {dashboard?.upcomingTasks?.length ? (
              dashboard.upcomingTasks.map((t) => <TaskCard key={t._id} task={t} compact />)
            ) : (
              <p className="text-text-muted text-sm py-4 text-center">No upcoming tasks</p>
            )}
          </Section>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Productivity score */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-background-surface border border-border rounded-lg p-4"
          >
            <h3 className="text-sm font-semibold text-text-primary mb-4">Productivity</h3>
            <ProductivityScore score={stats?.completionRate ?? 0} />
          </motion.div>

          {/* AI Daily Plan */}
          <DailyPlanWidget />

          {/* Overdue tasks */}
          {(dashboard?.overdueTasks?.length ?? 0) > 0 && (
            <Section title="Overdue 🔴" count={dashboard?.overdueTasks?.length}>
              {dashboard!.overdueTasks.map((t) => <TaskCard key={t._id} task={t} compact />)}
            </Section>
          )}

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-background-surface border border-border rounded-lg p-4"
          >
            <h3 className="text-sm font-semibold text-text-primary mb-3">Recent Activity</h3>
            <RecentActivity activities={dashboard?.recentActivity ?? []} />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function Section({
  title, count, children,
}: { title: string; count?: number; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-background-surface border border-border rounded-lg p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
        {count !== undefined && (
          <span className="text-xs bg-background-elevated border border-border text-text-secondary px-2 py-0.5 rounded-full">
            {count}
          </span>
        )}
      </div>
      <div className="space-y-2">{children}</div>
    </motion.div>
  )
}
