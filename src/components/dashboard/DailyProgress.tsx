import { Progress } from '@/components/ui/progress'
import type { DashboardSummary } from '@/lib/task-helpers'

export function DailyProgress({ summary }: { summary: DashboardSummary }) {
  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-semibold text-ink-900">Today&apos;s progress</p>
        <p className="text-sm font-bold text-brand-600">{summary.completionPercent}%</p>
      </div>
      <Progress value={summary.completionPercent} />
      <p className="text-xs text-ink-500">
        {summary.completedToday} of {summary.dueToday} tasks completed today
      </p>
    </div>
  )
}
