import { Wrench } from 'lucide-react'
import { useState } from 'react'
import { RoleSwitcher } from '@/components/layout/RoleSwitcher'
import { NotificationBell } from '@/components/notifications/NotificationBell'
import { TaskDetailPanel } from '@/components/tasks/TaskDetailPanel'
import { Avatar } from '@/components/ui/avatar'
import { findEmployee } from '@/data/employees'
import { EmployeeHome } from '@/pages/EmployeeHome'
import { useApp } from '@/store/AppContext'

export function EmployeeShell() {
  const { currentEmployeeId } = useApp()
  const employee = findEmployee(currentEmployeeId)
  const [openTaskId, setOpenTaskId] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-ink-50">
      <header className="sticky top-0 z-30 border-b border-ink-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Wrench className="size-5" />
          </span>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-bold tracking-tight text-ink-900">Mobridge Ace Hardware</p>
            <p className="text-xs text-ink-500">Employee</p>
          </div>
          {employee && <NotificationBell scope="employee" employeeId={employee.id} onOpenTask={setOpenTaskId} />}
          {employee && <Avatar initials={employee.initials} color={employee.color} />}
        </div>
        <div className="mx-auto max-w-2xl px-4 pb-3">
          <RoleSwitcher />
        </div>
      </header>

      <main className="px-4 py-6">
        <EmployeeHome onOpenTask={setOpenTaskId} />
      </main>

      <TaskDetailPanel taskId={openTaskId} onClose={() => setOpenTaskId(null)} />
    </div>
  )
}
