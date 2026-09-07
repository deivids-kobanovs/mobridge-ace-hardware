import { AlertTriangle, Bell, CheckCircle2, ClipboardCheck, Info, RotateCcw, ShieldAlert, Zap } from 'lucide-react'
import type { ComponentType } from 'react'
import { Button } from '@/components/ui/button'
import { timeAgo } from '@/lib/date'
import { cn } from '@/lib/utils'
import { useApp } from '@/store/AppContext'
import type { NotificationType } from '@/types'

const ICONS: Record<NotificationType, ComponentType<{ className?: string }>> = {
  reminder: Bell,
  overdue: AlertTriangle,
  escalation: Zap,
  approval_request: ClipboardCheck,
  blocked: ShieldAlert,
  returned: RotateCcw,
  approved: CheckCircle2,
  info: Info,
}

export function NotificationsPage({ onOpenTask }: { onOpenTask: (id: string) => void }) {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp()
  const managerNotifications = notifications.filter((n) => n.targetRole === 'manager')
  const unread = managerNotifications.filter((n) => !n.read).length

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-ink-900">Notifications</h1>
          <p className="text-sm text-ink-500">Reminders, escalations, blocked reports, and approval requests.</p>
        </div>
        {unread > 0 && (
          <Button variant="secondary" size="sm" onClick={() => markAllNotificationsRead('manager')}>
            Mark all read
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {managerNotifications.length === 0 && <p className="rounded-xl border border-dashed border-ink-200 p-10 text-center text-sm text-ink-400">No notifications yet.</p>}
        {managerNotifications.map((n) => {
          const Icon = ICONS[n.type]
          return (
            <button
              key={n.id}
              onClick={() => {
                markNotificationRead(n.id)
                if (n.taskId) onOpenTask(n.taskId)
              }}
              className={cn(
                'flex w-full items-start gap-3 rounded-xl border border-ink-200 bg-card p-4 text-left shadow-card transition-shadow hover:shadow-popover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                !n.read && 'border-brand-200 bg-brand-50/40',
              )}
            >
              <span
                className={cn(
                  'flex size-9 shrink-0 items-center justify-center rounded-full',
                  n.type === 'overdue' || n.type === 'escalation' || n.type === 'blocked'
                    ? 'bg-rose-100 text-rose-700'
                    : n.type === 'approved'
                      ? 'bg-emerald-100 text-emerald-700'
                      : n.type === 'returned'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-ink-100 text-ink-600',
                )}
              >
                <Icon className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm font-semibold text-ink-900">{n.title}</p>
                  <p className="shrink-0 text-xs text-ink-400">{timeAgo(n.timestamp)}</p>
                </div>
                <p className="mt-0.5 text-sm text-ink-600">{n.message}</p>
              </div>
              {!n.read && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-brand-600" aria-hidden="true" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
