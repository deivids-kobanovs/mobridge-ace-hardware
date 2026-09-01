import { Bell, Camera, ClipboardCheck, Repeat, Users as UsersIcon } from 'lucide-react'
import { PriorityBadge, StatusBadge } from '@/components/tasks/badges'
import { Avatar } from '@/components/ui/avatar'
import { findEmployee } from '@/data/employees'
import { formatTime12, formatTimestamp } from '@/lib/date'
import { assignmentLabel, checklistProgress, effectiveStatus } from '@/lib/task-helpers'
import { cn } from '@/lib/utils'
import type { Task } from '@/types'

export function TaskListItem({ task, now, onOpen }: { task: Task; now: Date; onOpen: (id: string) => void }) {
  const status = effectiveStatus(task, now)
  const progress = checklistProgress(task)
  const assignee = task.assignment.type === 'employee' ? findEmployee(task.assignment.employeeIds[0]) : undefined

  return (
    <button
      onClick={() => onOpen(task.id)}
      className="flex w-full flex-col gap-3 rounded-xl border border-ink-200 bg-white p-4 text-left shadow-card transition-shadow hover:shadow-popover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 sm:flex-row sm:items-center"
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        {assignee ? (
          <Avatar initials={assignee.initials} color={assignee.color} size="sm" />
        ) : (
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-400">
            <UsersIcon className="size-4" />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-semibold text-ink-900">{task.title}</p>
            {task.recurring && <Repeat className="size-3.5 shrink-0 text-ink-400" aria-label="Recurring" />}
            {task.reminders.remindBeforeDue && <Bell className="size-3.5 shrink-0 text-ink-400" aria-label="Reminder set" />}
            {task.requireApproval && <ClipboardCheck className="size-3.5 shrink-0 text-ink-400" aria-label="Approval required" />}
            {task.requirePhoto && <Camera className="size-3.5 shrink-0 text-ink-400" aria-label="Photo required" />}
          </div>
          <p className="truncate text-xs text-ink-500">{task.description || 'No description provided.'}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-400">
            <span>{task.department}</span>
            <span>·</span>
            <span>{assignmentLabel(task, (id) => findEmployee(id)?.name ?? 'Unknown')}</span>
            {task.checklist.length > 0 && (
              <>
                <span>·</span>
                <span>
                  {progress.done}/{progress.total} steps
                </span>
              </>
            )}
            {task.completedBy && (
              <>
                <span>·</span>
                <span>
                  Completed by {task.completedBy}
                  {task.completedAt ? `, ${formatTimestamp(task.completedAt)}` : ''}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-col sm:items-end">
        <div className="flex items-center gap-2">
          <PriorityBadge priority={task.priority} />
          <StatusBadge status={status} />
        </div>
        <p className={cn('text-xs font-medium', status === 'Overdue' ? 'text-brand-600' : 'text-ink-400')}>Due {formatTime12(task.dueTime)}</p>
      </div>
    </button>
  )
}
