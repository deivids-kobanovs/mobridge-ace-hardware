import { useState } from 'react'
import { EmployeeCard } from '@/components/employees/EmployeeCard'
import { EmployeeDetailModal } from '@/components/employees/EmployeeDetailModal'
import { EMPLOYEES } from '@/data/employees'
import { EMPLOYEE_COMPLETION } from '@/data/weeklyStats'
import { todayISO } from '@/lib/date'
import { isAssignedTo } from '@/lib/task-helpers'
import { useApp } from '@/store/AppContext'
import type { Employee } from '@/types'

export function Employees({ onOpenTask }: { onOpenTask: (id: string) => void }) {
  const { tasks } = useApp()
  const [selected, setSelected] = useState<Employee | null>(null)
  const today = todayISO()

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-ink-900">Employees</h1>
        <p className="text-sm text-ink-500">Workload and completion performance across the team.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {EMPLOYEES.map((e) => {
          const todayTasks = tasks.filter((t) => isAssignedTo(t, e.id) && t.dueDate === today && t.status !== 'Cancelled')
          const completedToday = todayTasks.filter((t) => t.status === 'Completed').length
          const blocked = tasks.filter((t) => isAssignedTo(t, e.id) && t.status === 'Blocked').length
          const stat = EMPLOYEE_COMPLETION.find((s) => s.name === e.name)
          return (
            <EmployeeCard
              key={e.id}
              employee={e}
              assignedToday={todayTasks.length}
              completedToday={completedToday}
              remainingToday={todayTasks.length - completedToday}
              blocked={blocked}
              completionRate={stat?.rate ?? 90}
              onOpen={() => setSelected(e)}
            />
          )
        })}
      </div>

      <EmployeeDetailModal employee={selected} onOpenChange={(v) => !v && setSelected(null)} onOpenTask={onOpenTask} />
    </div>
  )
}
