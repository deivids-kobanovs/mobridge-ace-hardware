import { useMemo, useState } from 'react'
import { DEFAULT_FILTERS, TaskFilters } from '@/components/tasks/TaskFilters'
import { TaskListItem } from '@/components/tasks/TaskListItem'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { findEmployee } from '@/data/employees'
import { todayISO } from '@/lib/date'
import { effectiveStatus, matchesFilters, matchesSearch, type TaskFilterState } from '@/lib/task-helpers'
import { useApp } from '@/store/AppContext'

type ViewId = 'all' | 'today' | 'upcoming' | 'completed' | 'blocked' | 'approval' | 'overdue'

const VIEWS: { id: ViewId; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'today', label: 'Today' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'completed', label: 'Completed' },
  { id: 'blocked', label: 'Blocked' },
  { id: 'approval', label: 'Awaiting Approval' },
  { id: 'overdue', label: 'Overdue' },
]

export function AllTasks({ searchQuery, onOpenTask }: { searchQuery: string; onOpenTask: (id: string) => void }) {
  const { tasks, now } = useApp()
  const [view, setView] = useState<ViewId>('all')
  const [filters, setFilters] = useState<TaskFilterState>(DEFAULT_FILTERS)
  const today = todayISO()

  const filtered = useMemo(() => {
    return tasks
      .filter((t) => {
        const status = effectiveStatus(t, now)
        switch (view) {
          case 'today':
            return t.dueDate === today && t.status !== 'Cancelled'
          case 'upcoming':
            return t.dueDate > today && t.status !== 'Cancelled' && t.status !== 'Completed'
          case 'completed':
            return t.status === 'Completed'
          case 'blocked':
            return t.status === 'Blocked'
          case 'approval':
            return t.status === 'Awaiting Approval'
          case 'overdue':
            return status === 'Overdue'
          default:
            return true
        }
      })
      .filter((t) => matchesFilters(t, filters, now))
      .filter((t) => matchesSearch(t, searchQuery, (id) => findEmployee(id)?.name ?? 'Unknown'))
      .sort((a, b) => (a.dueDate + a.dueTime).localeCompare(b.dueDate + b.dueTime))
  }, [tasks, view, filters, searchQuery, now, today])

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-ink-900">All Tasks</h1>
        <p className="text-sm text-ink-500">Every task across the store, filterable by status, employee, department, and more.</p>
      </div>

      <Tabs value={view} onValueChange={(v) => setView(v as ViewId)}>
        <TabsList>
          {VIEWS.map((v) => (
            <TabsTrigger key={v.id} value={v.id}>
              {v.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <TaskFilters value={filters} onChange={setFilters} />

      <p className="text-xs text-ink-400">
        {filtered.length} task{filtered.length === 1 ? '' : 's'}
        {searchQuery && ` matching "${searchQuery}"`}
      </p>

      <div className="space-y-2">
        {filtered.length === 0 && (
          <p className="rounded-xl border border-dashed border-ink-200 p-10 text-center text-sm text-ink-400">No tasks match these filters yet.</p>
        )}
        {filtered.map((t) => (
          <TaskListItem key={t.id} task={t} now={now} onOpen={onOpenTask} />
        ))}
      </div>
    </div>
  )
}
