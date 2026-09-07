import { CheckCircle2, Circle, Send } from 'lucide-react'
import { useState } from 'react'
import { AckStatsBar } from '@/components/content/AckStatsBar'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { findEmployee } from '@/data/employees'
import { formatTimestamp } from '@/lib/date'
import type { AckStats } from '@/lib/policy-helpers'

export function AckManagerPanel({
  stats,
  acknowledgedAt,
  onRemind,
}: {
  stats: AckStats
  acknowledgedAt: (employeeId: string) => string | undefined
  onRemind: (timing: 'now' | '24h' | '3d' | 'custom') => void
}) {
  const [timing, setTiming] = useState<'now' | '24h' | '3d' | 'custom'>('now')

  return (
    <div className="space-y-4 rounded-xl border border-ink-200 bg-white p-4">
      <AckStatsBar stats={stats} />

      {stats.acknowledgedIds.length > 0 && (
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-700">Acknowledged</p>
          <ul className="space-y-1.5">
            {stats.acknowledgedIds.map((id) => {
              const emp = findEmployee(id)
              if (!emp) return null
              return (
                <li key={id} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                  <Avatar initials={emp.initials} color={emp.color} size="sm" />
                  <span className="font-medium text-ink-800">{emp.name}</span>
                  <span className="ml-auto text-xs text-ink-400">{formatTimestamp(acknowledgedAt(id))}</span>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {stats.pendingIds.length > 0 && (
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-amber-700">Pending</p>
          <ul className="space-y-1.5">
            {stats.pendingIds.map((id) => {
              const emp = findEmployee(id)
              if (!emp) return null
              return (
                <li key={id} className="flex items-center gap-2 text-sm">
                  <Circle className="size-4 shrink-0 text-ink-300" />
                  <Avatar initials={emp.initials} color={emp.color} size="sm" />
                  <span className="font-medium text-ink-600">{emp.name}</span>
                </li>
              )
            })}
          </ul>

          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-ink-100 pt-3">
            <Select value={timing} onValueChange={(v) => setTiming(v as typeof timing)}>
              <SelectTrigger className="h-9 w-40 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="now">Immediately</SelectItem>
                <SelectItem value="24h">After 24 hours</SelectItem>
                <SelectItem value="3d">After 3 days</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" onClick={() => onRemind(timing)}>
              <Send className="size-3.5" />
              Remind Pending Employees
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
