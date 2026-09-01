import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { CreateTaskModal } from '@/components/tasks/CreateTaskModal'
import { TaskDetailPanel } from '@/components/tasks/TaskDetailPanel'
import type { ManagerPage } from '@/lib/navigation'
import { AllTasks } from '@/pages/AllTasks'
import { Employees } from '@/pages/Employees'
import { NotificationsPage } from '@/pages/Notifications'
import { Overview } from '@/pages/Overview'
import { RecurringTasks } from '@/pages/RecurringTasks'
import { Reports } from '@/pages/Reports'
import { Settings } from '@/pages/Settings'
import { Templates } from '@/pages/Templates'

export function ManagerShell() {
  const [page, setPage] = useState<ManagerPage>('overview')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [openTaskId, setOpenTaskId] = useState<string | null>(null)

  function goToTasksAndSearch() {
    setPage('tasks')
  }

  return (
    <div className="flex min-h-screen bg-ink-50">
      <Sidebar page={page} onNavigate={setPage} mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          searchQuery={searchQuery}
          onSearchChange={(v) => {
            setSearchQuery(v)
            if (v) goToTasksAndSearch()
          }}
          onCreateTask={() => setCreateOpen(true)}
          onOpenMobileNav={() => setMobileNavOpen(true)}
          onOpenTask={setOpenTaskId}
        />
        <main className="flex-1 px-4 py-6 lg:px-8">
          {page === 'overview' && <Overview onOpenTask={setOpenTaskId} onViewAllTasks={() => setPage('tasks')} />}
          {page === 'tasks' && <AllTasks searchQuery={searchQuery} onOpenTask={setOpenTaskId} />}
          {page === 'recurring' && <RecurringTasks onOpenTask={setOpenTaskId} />}
          {page === 'templates' && <Templates />}
          {page === 'employees' && <Employees onOpenTask={setOpenTaskId} />}
          {page === 'reports' && <Reports />}
          {page === 'notifications' && <NotificationsPage onOpenTask={setOpenTaskId} />}
          {page === 'settings' && <Settings />}
        </main>
      </div>

      <CreateTaskModal open={createOpen} onOpenChange={setCreateOpen} />
      <TaskDetailPanel taskId={openTaskId} onClose={() => setOpenTaskId(null)} />
    </div>
  )
}
