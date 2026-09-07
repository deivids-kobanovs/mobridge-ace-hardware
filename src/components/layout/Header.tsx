import { Menu, Plus, Search } from 'lucide-react'
import { NotificationBell } from '@/components/notifications/NotificationBell'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { RoleSwitcher } from '@/components/layout/RoleSwitcher'
import { MANAGER } from '@/data/employees'
import { formatDateLong } from '@/lib/date'

export function Header({
  searchQuery,
  onSearchChange,
  onCreateTask,
  onOpenMobileNav,
  onOpenTask,
}: {
  searchQuery: string
  onSearchChange: (v: string) => void
  onCreateTask: () => void
  onOpenMobileNav: () => void
  onOpenTask: (taskId: string) => void
}) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <header className="sticky top-0 z-30 border-b border-ink-200 bg-card/90 backdrop-blur">
      <div className="flex items-center gap-3 px-4 py-3 lg:px-8">
        <button onClick={onOpenMobileNav} className="rounded-md p-2 text-ink-600 hover:bg-ink-100 lg:hidden" aria-label="Open menu">
          <Menu className="size-5" />
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-bold text-ink-900">
            {greeting}, {MANAGER.name.split(' ')[0]}
          </h1>
          <p className="text-xs text-ink-500">{formatDateLong(new Date().toISOString().slice(0, 10))}</p>
        </div>

        <div className="hidden max-w-sm flex-1 md:block">
          <label className="relative block">
            <span className="sr-only">Search tasks</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-400" />
            <input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search tasks, employees, departments…"
              className="h-10 w-full rounded-lg border border-ink-200 bg-ink-50 pl-9 pr-3 text-sm text-ink-900 placeholder:text-ink-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:bg-card"
            />
          </label>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <RoleSwitcher />
        </div>

        <NotificationBell scope="manager" onOpenTask={onOpenTask} />

        <Button onClick={onCreateTask} className="hidden sm:inline-flex">
          <Plus className="size-4" />
          Create Task
        </Button>
        <Button onClick={onCreateTask} size="icon" className="sm:hidden" aria-label="Create task">
          <Plus className="size-5" />
        </Button>

        <Avatar initials={MANAGER.initials} color={MANAGER.color} className="hidden sm:flex" />
      </div>
      <div className="flex items-center gap-3 border-t border-ink-100 px-4 py-2 md:hidden">
        <label className="relative block flex-1">
          <span className="sr-only">Search tasks</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-400" />
          <input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search…"
            className="h-9 w-full rounded-lg border border-ink-200 bg-ink-50 pl-9 pr-3 text-sm placeholder:text-ink-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          />
        </label>
        <RoleSwitcher />
      </div>
    </header>
  )
}
