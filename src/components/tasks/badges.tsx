import { AlertTriangle, Bell, CheckCircle2, Circle, ClipboardCheck, Loader2, Repeat, RotateCcw, ShieldAlert, XCircle } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Priority, TaskStatus } from '@/types'

export function StatusBadge({ status, className }: { status: TaskStatus; className?: string }) {
  const map: Record<TaskStatus, { variant: ComponentProps<typeof Badge>['variant']; icon: ReactNode }> = {
    'Not Started': { variant: 'neutral', icon: <Circle className="size-3" /> },
    'In Progress': { variant: 'info', icon: <Loader2 className="size-3" /> },
    Blocked: { variant: 'warning', icon: <ShieldAlert className="size-3" /> },
    'Awaiting Approval': { variant: 'violet', icon: <ClipboardCheck className="size-3" /> },
    Completed: { variant: 'success', icon: <CheckCircle2 className="size-3" /> },
    Overdue: { variant: 'danger', icon: <AlertTriangle className="size-3" /> },
    'Returned for Correction': { variant: 'warning', icon: <RotateCcw className="size-3" /> },
    Cancelled: { variant: 'outline', icon: <XCircle className="size-3" /> },
  }
  const m = map[status]
  return (
    <Badge variant={m.variant} className={cn('whitespace-nowrap', className)}>
      {m.icon}
      {status}
    </Badge>
  )
}

export function PriorityBadge({ priority, className }: { priority: Priority; className?: string }) {
  const map: Record<Priority, ComponentProps<typeof Badge>['variant']> = {
    Low: 'neutral',
    Normal: 'info',
    High: 'warning',
    Urgent: 'danger',
  }
  return (
    <Badge variant={map[priority]} className={className}>
      {priority}
    </Badge>
  )
}

export function RecurringTag() {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-ink-500" title="Recurring task">
      <Repeat className="size-3.5" />
      Recurring
    </span>
  )
}

export function ReminderTag() {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-ink-500" title="Reminder configured">
      <Bell className="size-3.5" />
      Reminder
    </span>
  )
}

export function ApprovalTag() {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-ink-500" title="Requires manager approval">
      <ClipboardCheck className="size-3.5" />
      Approval required
    </span>
  )
}
