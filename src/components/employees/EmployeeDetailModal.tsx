import { Globe } from 'lucide-react'
import { LanguagePicker } from '@/components/content/LanguagePicker'
import { TaskListItem } from '@/components/tasks/TaskListItem'
import { Avatar } from '@/components/ui/avatar'
import { Dialog, Modal } from '@/components/ui/dialog'
import { isAssignedTo } from '@/lib/task-helpers'
import { useApp } from '@/store/AppContext'
import type { Employee } from '@/types'

export function EmployeeDetailModal({ employee, onOpenChange, onOpenTask }: { employee: Employee | null; onOpenChange: (v: boolean) => void; onOpenTask: (id: string) => void }) {
  const { tasks, now, getEmployeeLanguage, setEmployeeLanguage } = useApp()
  const assigned = employee ? tasks.filter((t) => isAssignedTo(t, employee.id) && t.status !== 'Cancelled').sort((a, b) => (a.dueDate + a.dueTime).localeCompare(b.dueDate + b.dueTime)) : []

  return (
    <Dialog open={!!employee} onOpenChange={onOpenChange}>
      {employee && (
        <Modal
          title={employee.name}
          description={`${employee.role} · ${employee.department} · ${employee.shiftLabel}`}
          size="lg"
        >
          <div className="mb-4 flex items-center gap-3">
            <Avatar initials={employee.initials} color={employee.color} size="lg" />
            <div>
              <p className="text-sm font-semibold text-ink-900">{employee.name}</p>
              <p className="text-xs text-ink-500">{employee.shiftStatus}</p>
            </div>
          </div>

          <div className="mb-4 flex items-center gap-2 rounded-lg border border-ink-200 p-3">
            <Globe className="size-4 shrink-0 text-ink-400" />
            <span className="text-sm font-medium text-ink-700">Preferred language</span>
            <LanguagePicker value={getEmployeeLanguage(employee.id)} onChange={(v) => setEmployeeLanguage(employee.id, v)} className="ml-auto h-8 w-48 text-xs" />
          </div>

          <p className="mb-3 text-sm font-semibold text-ink-900">All assigned tasks</p>
          <div className="space-y-2">
            {assigned.length === 0 && <p className="rounded-lg border border-dashed border-ink-200 p-6 text-center text-sm text-ink-400">No tasks assigned.</p>}
            {assigned.map((t) => (
              <TaskListItem key={t.id} task={t} now={now} onOpen={onOpenTask} />
            ))}
          </div>
        </Modal>
      )}
    </Dialog>
  )
}
