import {
  BarChart3,
  Bell,
  CalendarClock,
  ClipboardList,
  LayoutGrid,
  ListChecks,
  Settings,
  Users,
  Wrench,
  X,
} from 'lucide-react'
import type { ComponentType } from 'react'
import { MANAGER_NAV, type ManagerPage } from '@/lib/navigation'
import { cn } from '@/lib/utils'
import { useApp } from '@/store/AppContext'

const ICONS: Record<ManagerPage, ComponentType<{ className?: string }>> = {
  overview: LayoutGrid,
  tasks: ListChecks,
  recurring: CalendarClock,
  templates: ClipboardList,
  employees: Users,
  reports: BarChart3,
  notifications: Bell,
  settings: Settings,
}

export function Sidebar({
  page,
  onNavigate,
  mobileOpen,
  onCloseMobile,
}: {
  page: ManagerPage
  onNavigate: (p: ManagerPage) => void
  mobileOpen: boolean
  onCloseMobile: () => void
}) {
  const { notifications } = useApp()
  const unread = notifications.filter((n) => n.targetRole === 'manager' && !n.read).length

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white">
          <Wrench className="size-5" />
        </span>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-bold tracking-tight text-ink-900">Mobridge Ace Hardware</p>
          <p className="text-xs text-ink-500">Task Manager</p>
        </div>
        <button
          onClick={onCloseMobile}
          className="ml-auto rounded-md p-1.5 text-ink-400 hover:bg-ink-100 lg:hidden"
          aria-label="Close menu"
        >
          <X className="size-5" />
        </button>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4" aria-label="Manager navigation">
        {MANAGER_NAV.map((item) => {
          const Icon = ICONS[item.id]
          const active = page === item.id
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id)
                onCloseMobile()
              }}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                active ? 'bg-brand-50 text-brand-700' : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900',
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className={cn('size-4 shrink-0', active ? 'text-brand-600' : 'text-ink-400')} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.id === 'notifications' && unread > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-[11px] font-semibold text-white">
                  {unread}
                </span>
              )}
            </button>
          )
        })}
      </nav>
      <div className="border-t border-ink-100 px-4 py-4 text-xs text-ink-400">Demo build — data resets on request.</div>
    </div>
  )

  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-ink-200 bg-white lg:block">{content}</aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink-950/40" onClick={onCloseMobile} aria-hidden="true" />
          <aside className="absolute inset-y-0 left-0 w-72 bg-white shadow-popover">{content}</aside>
        </div>
      )}
    </>
  )
}
