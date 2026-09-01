import { Megaphone } from 'lucide-react'
import { useState } from 'react'
import { TaskListItem } from '@/components/tasks/TaskListItem'
import { Progress } from '@/components/ui/progress'
import { findEmployee } from '@/data/employees'
import { timeAgo, todayISO } from '@/lib/date'
import { isAssignedTo } from '@/lib/task-helpers'
import { useApp } from '@/store/AppContext'
import type { Task } from '@/types'

export function EmployeeHome({ onOpenTask }: { onOpenTask: (id: string) => void }) {
  const { tasks, now, currentEmployeeId, announcements } = useApp()
  const employee = findEmployee(currentEmployeeId)
  const today = todayISO()

  const mine = tasks.filter((t) => isAssignedTo(t, currentEmployeeId))
  const todayTasks = mine.filter((t) => t.dueDate === today && t.status !== 'Cancelled')
  const upcoming = mine.filter((t) => t.dueDate > today && t.status !== 'Cancelled' && t.status !== 'Completed')
  const blocked = mine.filter((t) => t.status === 'Blocked')
  const returned = mine.filter((t) => t.status === 'Returned for Correction')
  const awaitingApproval = mine.filter((t) => t.status === 'Awaiting Approval')
  const completed = mine.filter((t) => t.status === 'Completed').sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? ''))

  const completedToday = todayTasks.filter((t) => t.status === 'Completed').length
  const shiftProgress = todayTasks.length ? Math.round((completedToday / todayTasks.length) * 100) : 0

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-10">
      <div>
        <h1 className="text-xl font-bold text-ink-900">
          {greeting}, {employee?.name.split(' ')[0]}
        </h1>
        <p className="text-sm text-ink-500">
          {employee?.role} · {employee?.shiftLabel}
        </p>
      </div>

      <div className="rounded-xl border border-ink-200 bg-white p-4 shadow-card">
        <div className="mb-1.5 flex items-center justify-between">
          <p className="text-sm font-semibold text-ink-900">Shift progress</p>
          <p className="text-sm font-bold text-brand-600">{shiftProgress}%</p>
        </div>
        <Progress value={shiftProgress} />
        <p className="mt-1.5 text-xs text-ink-500">
          {completedToday} of {todayTasks.length} tasks completed today
        </p>
      </div>

      {announcements.length > 0 && (
        <div className="space-y-2 rounded-xl border border-sky-200 bg-sky-50 p-4">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-sky-700">
            <Megaphone className="size-3.5" /> Manager announcements
          </p>
          {announcements.slice(0, 2).map((a) => (
            <p key={a.id} className="text-sm text-sky-900">
              <span className="font-semibold">{a.author}:</span> {a.message}
              <span className="ml-2 text-xs text-sky-600">{timeAgo(a.timestamp)}</span>
            </p>
          ))}
        </div>
      )}

      <Section title="Returned to you" tasks={returned} tone="amber" now={now} onOpenTask={onOpenTask} />
      <Section title="Blocked" tasks={blocked} tone="amber" now={now} onOpenTask={onOpenTask} />
      <Section title="Today's tasks" tasks={todayTasks} now={now} onOpenTask={onOpenTask} emptyText="No tasks due today. Nice work staying caught up!" />
      <Section title="Awaiting manager approval" tasks={awaitingApproval} now={now} onOpenTask={onOpenTask} />
      <Section title="Upcoming" tasks={upcoming} now={now} onOpenTask={onOpenTask} />
      <Section title="Completed" tasks={completed} now={now} onOpenTask={onOpenTask} collapsedByDefault />
    </div>
  )
}

function Section({
  title,
  tasks,
  now,
  onOpenTask,
  tone,
  emptyText,
  collapsedByDefault,
}: {
  title: string
  tasks: Task[]
  now: Date
  onOpenTask: (id: string) => void
  tone?: 'amber'
  emptyText?: string
  collapsedByDefault?: boolean
}) {
  const [expanded, setExpanded] = useState(!collapsedByDefault)
  if (tasks.length === 0 && !emptyText) return null
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h2 className={`text-sm font-semibold ${tone === 'amber' ? 'text-amber-700' : 'text-ink-900'}`}>{title}</h2>
        {tasks.length > 0 && collapsedByDefault ? (
          <button onClick={() => setExpanded((v) => !v)} className="text-xs font-semibold text-brand-700 hover:underline focus-visible:outline-none">
            {expanded ? 'Hide' : 'Show'} ({tasks.length})
          </button>
        ) : (
          <span className="text-xs text-ink-400">{tasks.length}</span>
        )}
      </div>
      {tasks.length === 0 ? (
        <p className="rounded-lg border border-dashed border-ink-200 p-4 text-center text-sm text-ink-400">{emptyText}</p>
      ) : expanded ? (
        <div className="space-y-2">
          {tasks.map((t) => (
            <TaskListItem key={t.id} task={t} now={now} onOpen={onOpenTask} />
          ))}
        </div>
      ) : null}
    </div>
  )
}
