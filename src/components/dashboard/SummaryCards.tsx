import { AlertTriangle, CalendarCheck, CheckCircle2, ClipboardCheck, ListTodo, Percent, ShieldAlert } from 'lucide-react'
import type { ComponentType } from 'react'
import { cn } from '@/lib/utils'
import type { DashboardSummary } from '@/lib/task-helpers'

export function SummaryCards({ summary }: { summary: DashboardSummary }) {
  const cards: { label: string; value: string | number; icon: ComponentType<{ className?: string }>; tone: string }[] = [
    { label: 'Due today', value: summary.dueToday, icon: CalendarCheck, tone: 'text-ink-700 bg-ink-100' },
    { label: 'Completed today', value: summary.completedToday, icon: CheckCircle2, tone: 'text-emerald-700 bg-emerald-100' },
    { label: 'Tasks remaining', value: summary.remaining, icon: ListTodo, tone: 'text-sky-700 bg-sky-100' },
    { label: 'Overdue', value: summary.overdue, icon: AlertTriangle, tone: 'text-brand-700 bg-brand-100' },
    { label: 'Blocked', value: summary.blocked, icon: ShieldAlert, tone: 'text-amber-700 bg-amber-100' },
    { label: 'Awaiting approval', value: summary.awaitingApproval, icon: ClipboardCheck, tone: 'text-violet-700 bg-violet-100' },
    { label: 'Completion rate', value: `${summary.completionPercent}%`, icon: Percent, tone: 'text-ink-700 bg-ink-100' },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
      {cards.map((c) => (
        <div key={c.label} className="rounded-xl border border-ink-200 bg-white p-4 shadow-card">
          <span className={cn('mb-3 inline-flex size-9 items-center justify-center rounded-lg', c.tone)}>
            <c.icon className="size-5" />
          </span>
          <p className="text-2xl font-bold text-ink-900">{c.value}</p>
          <p className="text-xs text-ink-500">{c.label}</p>
        </div>
      ))}
    </div>
  )
}
