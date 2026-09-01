import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  MessageSquare,
  PlusCircle,
  RotateCcw,
  ShieldAlert,
  ShieldOff,
  UserCog,
  XCircle,
  Zap,
} from 'lucide-react'
import type { ComponentType } from 'react'
import { formatTimestamp } from '@/lib/date'
import { cn } from '@/lib/utils'
import type { ActivityEntry, ActivityType } from '@/types'

const ICONS: Record<ActivityType, ComponentType<{ className?: string }>> = {
  created: PlusCircle,
  assigned: UserCog,
  reassigned: UserCog,
  status: ClipboardCheck,
  reminder: ClipboardCheck,
  overdue: AlertTriangle,
  escalated: Zap,
  blocked: ShieldAlert,
  unblocked: ShieldOff,
  note: MessageSquare,
  submitted: ClipboardCheck,
  approved: CheckCircle2,
  returned: RotateCcw,
  completed: CheckCircle2,
  cancelled: XCircle,
  rescheduled: ClipboardCheck,
  message: MessageSquare,
}

const COLORS: Partial<Record<ActivityType, string>> = {
  blocked: 'bg-brand-100 text-brand-700',
  overdue: 'bg-brand-100 text-brand-700',
  escalated: 'bg-brand-100 text-brand-700',
  cancelled: 'bg-ink-200 text-ink-600',
  completed: 'bg-emerald-100 text-emerald-700',
  approved: 'bg-emerald-100 text-emerald-700',
  returned: 'bg-amber-100 text-amber-700',
  unblocked: 'bg-emerald-100 text-emerald-700',
}

export function ActivityTimeline({ entries }: { entries: ActivityEntry[] }) {
  const sorted = [...entries].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  if (sorted.length === 0) return <p className="text-sm text-ink-400">No activity yet.</p>

  return (
    <ol className="space-y-4">
      {sorted.map((entry) => {
        const Icon = ICONS[entry.type]
        return (
          <li key={entry.id} className="flex gap-3">
            <span className={cn('mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full', COLORS[entry.type] ?? 'bg-ink-100 text-ink-500')}>
              <Icon className="size-3.5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-ink-800">
                <span className="font-semibold">{entry.actor}</span> <span className="text-ink-400">—</span> {entry.message}
              </p>
              <p className="text-xs text-ink-400">{formatTimestamp(entry.timestamp)}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
