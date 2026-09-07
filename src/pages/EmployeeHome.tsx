import { BookOpen, CheckCircle2, ChevronRight, Megaphone, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { TaskListItem } from '@/components/tasks/TaskListItem'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { findEmployee } from '@/data/employees'
import { timeAgo, todayISO } from '@/lib/date'
import { hasAcknowledgedHandbook, hasAcknowledgedPolicy } from '@/lib/policy-helpers'
import { isAssignedTo } from '@/lib/task-helpers'
import { useApp } from '@/store/AppContext'
import type { Task } from '@/types'

export function EmployeeHome({
  onOpenTask,
  onGoToPolicies,
  onGoToHandbook,
}: {
  onOpenTask: (id: string) => void
  onGoToPolicies: (policyId?: string) => void
  onGoToHandbook: () => void
}) {
  const { tasks, now, currentEmployeeId, announcements, policies, policyAcknowledgements, handbook, handbookAcknowledgements } = useApp()
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

  const pendingPolicies = policies.filter(
    (p) => p.status === 'Published' && !p.archived && p.requiresAcknowledgement && !hasAcknowledgedPolicy(p, currentEmployeeId, policyAcknowledgements),
  )
  const handbookPending = handbook.requiresFullAcknowledgement && !hasAcknowledgedHandbook(handbook.version, currentEmployeeId, handbookAcknowledgements)
  const requiredReadingCount = pendingPolicies.length + (handbookPending ? 1 : 0)

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-xl font-bold text-ink-900">
          {greeting}, {employee?.name.split(' ')[0]}
        </h1>
        <p className="text-sm text-ink-500">
          {employee?.role} · {employee?.shiftLabel}
        </p>
      </div>

      <div className="rounded-xl border border-ink-200 bg-card p-4 shadow-card">
        <div className="mb-1.5 flex items-center justify-between">
          <p className="text-sm font-semibold text-ink-900">Shift progress</p>
          <p className="text-sm font-bold text-brand-600">{shiftProgress}%</p>
        </div>
        <Progress value={shiftProgress} />
        <p className="mt-1.5 text-xs text-ink-500">
          {completedToday} of {todayTasks.length} tasks completed today
        </p>
      </div>

      {requiredReadingCount > 0 ? (
        <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-900">
            {requiredReadingCount} update{requiredReadingCount === 1 ? '' : 's'} require{requiredReadingCount === 1 ? 's' : ''} your acknowledgement
          </p>
          <ul className="space-y-1.5">
            {pendingPolicies.map((p) => (
              <li key={p.id}>
                <button onClick={() => onGoToPolicies(p.id)} className="flex w-full items-center justify-between gap-2 text-left text-sm text-amber-900 hover:underline">
                  {p.title}
                  <ChevronRight className="size-3.5 shrink-0" />
                </button>
              </li>
            ))}
            {handbookPending && (
              <li>
                <button onClick={onGoToHandbook} className="flex w-full items-center justify-between gap-2 text-left text-sm text-amber-900 hover:underline">
                  Employee Handbook
                  <ChevronRight className="size-3.5 shrink-0" />
                </button>
              </li>
            )}
          </ul>
          <Button size="sm" onClick={() => onGoToPolicies(pendingPolicies[0]?.id)}>
            Review Updates
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          <CheckCircle2 className="size-4" />
          You&apos;re up to date on required reading.
        </div>
      )}

      <div className="rounded-xl border border-ink-200 bg-card p-4 shadow-card">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-400">Company Resources</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onGoToPolicies()}
            className="flex flex-col items-start gap-2 rounded-lg border border-ink-100 p-3 text-left hover:bg-ink-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <ShieldCheck className="size-4 text-brand-600" />
            <span className="text-sm font-semibold text-ink-800">Policies & Procedures</span>
          </button>
          <button
            onClick={onGoToHandbook}
            className="flex flex-col items-start gap-2 rounded-lg border border-ink-100 p-3 text-left hover:bg-ink-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <BookOpen className="size-4 text-brand-600" />
            <span className="text-sm font-semibold text-ink-800">Handbook</span>
          </button>
        </div>
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
