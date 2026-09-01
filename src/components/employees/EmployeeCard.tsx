import { Avatar } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import type { Employee } from '@/types'

export function EmployeeCard({
  employee,
  assignedToday,
  completedToday,
  remainingToday,
  blocked,
  completionRate,
  onOpen,
}: {
  employee: Employee
  assignedToday: number
  completedToday: number
  remainingToday: number
  blocked: number
  completionRate: number
  onOpen: () => void
}) {
  return (
    <button
      onClick={onOpen}
      className="flex flex-col gap-4 rounded-xl border border-ink-200 bg-white p-5 text-left shadow-card transition-shadow hover:shadow-popover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
    >
      <div className="flex items-center gap-3">
        <Avatar initials={employee.initials} color={employee.color} size="lg" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink-900">{employee.name}</p>
          <p className="truncate text-xs text-ink-500">
            {employee.role} · {employee.department}
          </p>
        </div>
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold',
            employee.shiftStatus === 'On Shift' ? 'bg-emerald-100 text-emerald-700' : employee.shiftStatus === 'On Break' ? 'bg-amber-100 text-amber-700' : 'bg-ink-100 text-ink-500',
          )}
        >
          <span
            className={cn('size-1.5 rounded-full', employee.shiftStatus === 'On Shift' ? 'bg-emerald-500' : employee.shiftStatus === 'On Break' ? 'bg-amber-500' : 'bg-ink-400')}
          />
          {employee.shiftStatus}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2 text-center">
        <Stat value={assignedToday} label="Assigned" />
        <Stat value={completedToday} label="Done" />
        <Stat value={remainingToday} label="Remaining" />
        <Stat value={blocked} label="Blocked" tone={blocked > 0 ? 'text-brand-600' : undefined} />
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between text-xs text-ink-500">
          <span>Completion rate (7-day)</span>
          <span className="font-semibold text-ink-700">{completionRate}%</span>
        </div>
        <Progress value={completionRate} />
      </div>
    </button>
  )
}

function Stat({ value, label, tone }: { value: number; label: string; tone?: string }) {
  return (
    <div>
      <p className={cn('text-lg font-bold text-ink-900', tone)}>{value}</p>
      <p className="text-[11px] text-ink-400">{label}</p>
    </div>
  )
}
