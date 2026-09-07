import { BlockedReasonsChart, DepartmentCompletionChart, EmployeeCompletionChart, OnTimeVsLateChart } from '@/components/reports/Charts'
import { WeeklyCompletionChart } from '@/components/dashboard/WeeklyCompletionChart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { APPROVAL_TIME_STATS, BLOCKED_REASONS_STATS, CHECKLIST_COMPLIANCE, RECURRING_PERFORMANCE } from '@/data/weeklyStats'

export function Reports() {
  const topBlockedReason = [...BLOCKED_REASONS_STATS].sort((a, b) => b.count - a.count)[0]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-bold text-ink-900">Reports</h1>
        <p className="text-sm text-ink-500">Store performance across completion, timeliness, and accountability.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Avg. approval time" value={`${APPROVAL_TIME_STATS.averageMinutes} min`} sub={`Median ${APPROVAL_TIME_STATS.medianMinutes} min`} />
        <StatCard label="Approved within 15 min" value={`${APPROVAL_TIME_STATS.underFifteenPercent}%`} />
        <StatCard label="Opening compliance" value={`${CHECKLIST_COMPLIANCE.opening.onTime}%`} sub={`${CHECKLIST_COMPLIANCE.opening.total} openings tracked`} />
        <StatCard label="Closing compliance" value={`${CHECKLIST_COMPLIANCE.closing.onTime}%`} sub={`${CHECKLIST_COMPLIANCE.closing.total} closings tracked`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly completion rate</CardTitle>
          </CardHeader>
          <CardContent>
            <WeeklyCompletionChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>On-time vs. late completion</CardTitle>
          </CardHeader>
          <CardContent>
            <OnTimeVsLateChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Completion by department</CardTitle>
          </CardHeader>
          <CardContent>
            <DepartmentCompletionChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Completion by employee</CardTitle>
          </CardHeader>
          <CardContent>
            <EmployeeCompletionChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Most common blocked-task reasons</CardTitle>
          </CardHeader>
          <CardContent>
            <BlockedReasonsChart />
            {topBlockedReason && (
              <p className="mt-2 text-center text-xs text-ink-500">
                Most frequent: <span className="font-semibold text-ink-700">{topBlockedReason.reason}</span>
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recurring-task performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {RECURRING_PERFORMANCE.map((r) => (
              <div key={r.name} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-ink-800">{r.name}</span>
                  <span className="text-ink-500">
                    {r.completionRate}% complete · {r.onTimeRate}% on time
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
                  <div className="h-full rounded-full bg-brand-600" style={{ width: `${r.completionRate}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-ink-200 bg-card p-4 shadow-card">
      <p className="text-2xl font-bold text-ink-900">{value}</p>
      <p className="text-xs text-ink-500">{label}</p>
      {sub && <p className="mt-1 text-xs text-ink-400">{sub}</p>}
    </div>
  )
}
