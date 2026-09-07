import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import type { AckStats } from '@/lib/policy-helpers'

export function AckStatsBar({ stats, label = 'acknowledged', className }: { stats: AckStats; className?: string; label?: string }) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-medium text-ink-700">
          {stats.acknowledgedCount} / {stats.total} {label}
        </span>
        <span className={cn('font-bold', stats.percent === 100 ? 'text-emerald-600' : 'text-ink-500')}>{stats.percent}%</span>
      </div>
      <Progress value={stats.percent} indicatorClassName={stats.percent === 100 ? 'bg-emerald-500' : undefined} />
    </div>
  )
}
