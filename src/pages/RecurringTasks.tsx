import { Repeat } from 'lucide-react'
import { TaskListItem } from '@/components/tasks/TaskListItem'
import { Card, CardContent } from '@/components/ui/card'
import { recurrenceSummary } from '@/lib/task-helpers'
import { useApp } from '@/store/AppContext'

export function RecurringTasks({ onOpenTask }: { onOpenTask: (id: string) => void }) {
  const { tasks, now } = useApp()
  const recurring = tasks.filter((t) => t.recurring).sort((a, b) => (a.dueDate + a.dueTime).localeCompare(b.dueDate + b.dueTime))

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-ink-900">Recurring Tasks</h1>
        <p className="text-sm text-ink-500">Tasks that repeat on a schedule, with their next occurrence shown below.</p>
      </div>

      {recurring.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
            <Repeat className="size-8 text-ink-300" />
            <p className="text-sm text-ink-500">No recurring tasks yet. Enable &quot;Recurring task&quot; when creating one.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {recurring.map((t) => (
            <div key={t.id} className="space-y-1.5">
              <TaskListItem task={t} now={now} onOpen={onOpenTask} />
              <p className="flex items-center gap-1.5 pl-1 text-xs text-ink-400">
                <Repeat className="size-3" />
                {recurrenceSummary(t)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
