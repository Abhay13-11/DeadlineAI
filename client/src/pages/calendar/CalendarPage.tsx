import { useEffect, useRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import { useTasks } from '../../hooks/useTasks'
import { useUIStore } from '../../store/uiStore'
import { CATEGORY_COLORS } from '../../types'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/common/PageHeader'
import { Plus } from 'lucide-react'
import { formatDateInputValue } from '../../utils/taskUtils'

export function CalendarPage() {
  const { tasks, fetchTasks } = useTasks()
  const { openTaskForm } = useUIStore()
  const navigate = useNavigate()
  const calRef = useRef<FullCalendar>(null)

  useEffect(() => {
    void fetchTasks({ limit: 200, status: undefined })
  }, [fetchTasks])

  const events = tasks
    .filter((t) => t.deadline)
    .map((t) => ({
      id: t._id,
      title: t.title,
      date: formatDateInputValue(t.deadline),
      color: CATEGORY_COLORS[t.category],
      extendedProps: { status: t.status, priority: t.priority },
      classNames: t.status === 'Completed' ? ['opacity-50'] : [],
    }))

  return (
    <div className="space-y-5">
      <PageHeader
        title="Calendar"
        description="View all your tasks and deadlines on a calendar."
        actions={
          <button onClick={() => openTaskForm()} className="btn-primary flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> New Task
          </button>
        }
      />

      <div className="bg-background-surface border border-border rounded-xl p-4 calendar-wrapper">
        <FullCalendar
          ref={calRef}
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,listWeek',
          }}
          events={events}
          eventClick={({ event }) => void navigate(`/tasks/${event.id}`)}
          dateClick={() => {
            openTaskForm()
          }}
          height="auto"
          eventDisplay="block"
          dayMaxEvents={4}
          themeSystem="standard"
        />
      </div>

      <style>{`
        .calendar-wrapper .fc {
          --fc-border-color: rgb(var(--border));
          --fc-button-bg-color: rgb(var(--bg-elevated));
          --fc-button-border-color: rgb(var(--border));
          --fc-button-hover-bg-color: rgb(var(--border));
          --fc-button-active-bg-color: #7C6AF7;
          --fc-button-text-color: rgb(var(--text-secondary));
          --fc-today-bg-color: rgba(124,106,247,0.08);
          --fc-page-bg-color: transparent;
          font-family: 'Inter', sans-serif;
          color: rgb(var(--text-primary));
        }
        .calendar-wrapper .fc-toolbar-title { font-size: 1rem; font-weight: 600; color: rgb(var(--text-primary)); }
        .calendar-wrapper .fc-col-header-cell-cushion,
        .calendar-wrapper .fc-daygrid-day-number { color: rgb(var(--text-secondary)); font-size: 0.75rem; text-decoration: none; }
        .calendar-wrapper .fc-daygrid-day-number:hover { color: rgb(var(--text-primary)); }
        .calendar-wrapper .fc-event { border-radius: 4px; border: none; font-size: 0.7rem; font-weight: 500; padding: 1px 4px; cursor: pointer; }
        .calendar-wrapper .fc-button { border-radius: 6px !important; font-size: 0.75rem !important; padding: 4px 10px !important; }
        .calendar-wrapper .fc-button-primary:not(:disabled):active,
        .calendar-wrapper .fc-button-primary.fc-button-active { background: #7C6AF7 !important; border-color: #7C6AF7 !important; color: white !important; }
      `}</style>
    </div>
  )
}