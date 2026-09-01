import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { AlertTriangle, Bell, CheckCircle2, ClipboardCheck, Info, RotateCcw, ShieldAlert, Zap } from 'lucide-react'
import type { ComponentType } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { timeAgo } from '@/lib/date'
import { cn } from '@/lib/utils'
import { useApp } from '@/store/AppContext'
import type { AppNotification, NotificationType, Role } from '@/types'

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

export function NotificationBell({ scope, employeeId, onOpenTask }: { scope: Role; employeeId?: string; onOpenTask: (taskId: string) => void }) {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp()
  const relevant = notifications.filter((n) => n.targetRole === scope && (scope === 'manager' || n.employeeId === employeeId))
  const unread = relevant.filter((n) => !n.read).length

  function handleSelect(n: AppNotification) {
    markNotificationRead(n.id)
    if (n.taskId) onOpenTask(n.taskId)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="relative flex size-10 items-center justify-center rounded-lg border border-ink-200 bg-white text-ink-600 shadow-sm hover:bg-ink-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ''}`}
      >
        <Bell className="size-5" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-[11px] font-semibold text-white">
            {unread}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 p-0">
        <div className="flex items-center justify-between border-b border-ink-100 px-4 py-3">
          <p className="text-sm font-semibold text-ink-900">Notifications</p>
          {unread > 0 && (
            <button onClick={() => markAllNotificationsRead(scope)} className="text-xs font-semibold text-brand-700 hover:underline">
              Mark all read
            </button>
          )}
        </div>
        <div className="max-h-96 overflow-y-auto">
          {relevant.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-ink-400">You&apos;re all caught up.</p>
          ) : (
            relevant.slice(0, 20).map((n) => {
              const Icon = ICONS[n.type]
              return (
                <DropdownMenuPrimitive.Item
                  key={n.id}
                  onSelect={() => handleSelect(n)}
                  className={cn(
                    'flex cursor-pointer gap-3 border-b border-ink-50 px-4 py-3 outline-none last:border-0 hover:bg-ink-50 data-[highlighted]:bg-ink-50',
                    !n.read && 'bg-brand-50/60',
                  )}
                >
                  <span
                    className={cn(
                      'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full',
                      n.type === 'overdue' || n.type === 'escalation' || n.type === 'blocked'
                        ? 'bg-brand-100 text-brand-700'
                        : n.type === 'approved'
                          ? 'bg-emerald-100 text-emerald-700'
                          : n.type === 'returned'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-ink-100 text-ink-600',
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="text-sm font-semibold text-ink-900">{n.title}</span>
                      <span className="shrink-0 text-xs text-ink-400">{timeAgo(n.timestamp)}</span>
                    </span>
                    <span className="mt-0.5 block text-sm text-ink-600">{n.message}</span>
                  </span>
                  {!n.read && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-brand-600" aria-hidden="true" />}
                </DropdownMenuPrimitive.Item>
              )
            })
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
