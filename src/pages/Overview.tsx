import { ArrowRight, ShieldCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DailyProgress } from '@/components/dashboard/DailyProgress'
import { SummaryCards } from '@/components/dashboard/SummaryCards'
import { WeeklyCompletionChart } from '@/components/dashboard/WeeklyCompletionChart'
import { TaskListItem } from '@/components/tasks/TaskListItem'
import { todayISO } from '@/lib/date'
import { policiesUpdatedWithinDays, policyAckStats } from '@/lib/policy-helpers'
import { computeSummary } from '@/lib/task-helpers'
import { useApp } from '@/store/AppContext'

export function Overview({
  onOpenTask,
  onViewAllTasks,
  onViewPolicy,
}: {
  onOpenTask: (id: string) => void
  onViewAllTasks: () => void
  onViewPolicy: (policyId?: string) => void
}) {
  const { tasks, now, policies, policyAcknowledgements } = useApp()
  const today = todayISO()
  const summary = computeSummary(tasks, today, now)

  const todayTasks = tasks
    .filter((t) => t.dueDate === today && t.status !== 'Cancelled')
    .sort((a, b) => a.dueTime.localeCompare(b.dueTime))

  const needsAttention = tasks.filter((t) => t.status === 'Blocked' || t.status === 'Awaiting Approval').slice(0, 4)

  const trackedPolicies = policies.filter((p) => p.status === 'Published' && !p.archived && p.requiresAcknowledgement)
  const policyStats = trackedPolicies.map((p) => policyAckStats(p, policyAcknowledgements))
  const avgAckRate = policyStats.length ? Math.round(policyStats.reduce((sum, s) => sum + s.percent, 0) / policyStats.length) : 100
  const totalPending = policyStats.reduce((sum, s) => sum + s.pendingIds.length, 0)
  const updatedThisMonth = policiesUpdatedWithinDays(policies, 30).length

  return (
    <div className="space-y-6">
      <SummaryCards summary={summary} />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly completion</CardTitle>
          </CardHeader>
          <CardContent>
            <WeeklyCompletionChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <DailyProgress summary={summary} />
            {needsAttention.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Needs attention</p>
                {needsAttention.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => onOpenTask(t.id)}
                    className="flex w-full items-center justify-between gap-2 rounded-lg bg-ink-50 px-3 py-2 text-left text-xs hover:bg-ink-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                  >
                    <span className="truncate font-medium text-ink-700">{t.title}</span>
                    <span className="shrink-0 rounded-full bg-white px-2 py-0.5 font-semibold text-ink-500">{t.status}</span>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-brand-600" />
            Policies
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => onViewPolicy()}>
            View Policies
            <ArrowRight className="size-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <p className="text-2xl font-bold text-ink-900">{updatedThisMonth}</p>
              <p className="text-xs text-ink-500">policies updated this month</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-ink-900">{avgAckRate}%</p>
              <p className="text-xs text-ink-500">average acknowledgement rate</p>
            </div>
            <div>
              <p className={`text-2xl font-bold ${totalPending > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>{totalPending}</p>
              <p className="text-xs text-ink-500">employee acknowledgements pending</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-ink-900">Today&apos;s tasks</h2>
          <Button variant="ghost" size="sm" onClick={onViewAllTasks}>
            View all tasks
            <ArrowRight className="size-4" />
          </Button>
        </div>
        <div className="space-y-2">
          {todayTasks.length === 0 && <p className="rounded-xl border border-dashed border-ink-200 p-8 text-center text-sm text-ink-400">No tasks scheduled for today.</p>}
          {todayTasks.map((t) => (
            <TaskListItem key={t.id} task={t} now={now} onOpen={onOpenTask} />
          ))}
        </div>
      </div>
    </div>
  )
}
