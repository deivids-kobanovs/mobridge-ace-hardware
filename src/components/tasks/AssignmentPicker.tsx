import { Check, Search, UserX, Users as UsersIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { Avatar } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { EMPLOYEES } from '@/data/employees'
import { todayISO } from '@/lib/date'
import { tasksAssignedToday } from '@/lib/task-helpers'
import { cn } from '@/lib/utils'
import { useApp } from '@/store/AppContext'
import { DEPARTMENTS, type Assignment, type CompletionMode, type Department } from '@/types'

const TYPE_OPTIONS: { value: Assignment['type']; label: string; description: string; icon: ReactNode }[] = [
  { value: 'employee', label: 'Specific employee', description: 'Assign to one associate', icon: <UsersIcon className="size-4" /> },
  { value: 'multiple', label: 'Multiple employees', description: 'Assign to more than one associate', icon: <UsersIcon className="size-4" /> },
  { value: 'department', label: 'Department or team', description: 'Assign to a whole department', icon: <UsersIcon className="size-4" /> },
  { value: 'unassigned', label: 'Leave unassigned', description: 'Assign later from All Tasks', icon: <UserX className="size-4" /> },
]

export function AssignmentPicker({ value, onChange }: { value: Assignment; onChange: (a: Assignment) => void }) {
  const { tasks } = useApp()
  const [query, setQuery] = useState('')
  const today = todayISO()

  const filtered = useMemo(
    () =>
      EMPLOYEES.filter(
        (e) => e.name.toLowerCase().includes(query.toLowerCase()) || e.department.toLowerCase().includes(query.toLowerCase()) || e.role.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  )

  function setType(type: Assignment['type']) {
    if (type === 'employee') onChange({ type, employeeIds: value.employeeIds.slice(0, 1) })
    else if (type === 'multiple') onChange({ type, employeeIds: value.employeeIds, completionMode: value.completionMode ?? 'any' })
    else if (type === 'department') onChange({ type, employeeIds: [], department: value.department ?? 'Store Wide' })
    else onChange({ type: 'unassigned', employeeIds: [] })
  }

  function toggleEmployee(id: string) {
    if (value.type === 'employee') {
      onChange({ ...value, employeeIds: [id] })
    } else if (value.type === 'multiple') {
      const has = value.employeeIds.includes(id)
      onChange({ ...value, employeeIds: has ? value.employeeIds.filter((e) => e !== id) : [...value.employeeIds, id] })
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {TYPE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setType(opt.value)}
            className={cn(
              'flex flex-col items-start gap-1 rounded-lg border px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
              value.type === opt.value ? 'border-brand-500 bg-brand-50 text-brand-800' : 'border-ink-200 bg-white text-ink-600 hover:bg-ink-50',
            )}
          >
            <span className="flex items-center gap-1.5 text-xs font-semibold">
              {opt.icon}
              {opt.label}
            </span>
            <span className="text-[11px] text-ink-400">{opt.description}</span>
          </button>
        ))}
      </div>

      {(value.type === 'employee' || value.type === 'multiple') && (
        <div className="space-y-2">
          <label className="relative block">
            <span className="sr-only">Search employees</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-400" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search employees by name, role, or department…" className="pl-9" />
          </label>
          <div className="max-h-64 space-y-1.5 overflow-y-auto rounded-lg border border-ink-200 p-1.5">
            {filtered.length === 0 && <p className="px-2 py-4 text-center text-sm text-ink-400">No employees match.</p>}
            {filtered.map((e) => {
              const selected = value.employeeIds.includes(e.id)
              const count = tasksAssignedToday(tasks, e.id, today).length
              const available = e.shiftStatus === 'On Shift'
              return (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => toggleEmployee(e.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                    selected ? 'border-brand-500 bg-brand-50' : 'border-transparent hover:bg-ink-50',
                  )}
                >
                  <Avatar initials={e.initials} color={e.color} size="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold text-ink-900">{e.name}</span>
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                          available ? 'bg-emerald-100 text-emerald-700' : e.shiftStatus === 'On Break' ? 'bg-amber-100 text-amber-700' : 'bg-ink-100 text-ink-500',
                        )}
                      >
                        <span className={cn('size-1.5 rounded-full', available ? 'bg-emerald-500' : e.shiftStatus === 'On Break' ? 'bg-amber-500' : 'bg-ink-400')} />
                        {e.shiftStatus}
                      </span>
                    </span>
                    <span className="block truncate text-xs text-ink-500">
                      {e.role} · {e.department} · {e.shiftLabel}
                    </span>
                  </span>
                  <span className="shrink-0 text-right text-xs text-ink-400">
                    {count} task{count === 1 ? '' : 's'}
                    <br />
                    today
                  </span>
                  {selected && <Check className="size-4 shrink-0 text-brand-600" />}
                </button>
              )
            })}
          </div>
          {value.type === 'multiple' && (
            <div className="flex items-center gap-2 rounded-lg bg-ink-50 px-3 py-2.5">
              <span className="text-xs font-medium text-ink-600">Completion rule:</span>
              <CompletionModeToggle value={value.completionMode ?? 'any'} onChange={(m) => onChange({ ...value, completionMode: m })} />
            </div>
          )}
        </div>
      )}

      {value.type === 'department' && (
        <Select value={value.department} onValueChange={(d: Department) => onChange({ ...value, department: d })}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a department" />
          </SelectTrigger>
          <SelectContent>
            {DEPARTMENTS.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {value.type === 'unassigned' && <p className="rounded-lg bg-ink-50 px-3 py-2.5 text-sm text-ink-500">This task will appear as unassigned until a manager assigns it from All Tasks.</p>}
    </div>
  )
}

function CompletionModeToggle({ value, onChange }: { value: CompletionMode; onChange: (m: CompletionMode) => void }) {
  return (
    <div className="flex rounded-md border border-ink-200 bg-white p-0.5 text-xs font-semibold">
      <button
        type="button"
        onClick={() => onChange('any')}
        className={cn('rounded px-2.5 py-1 transition-colors', value === 'any' ? 'bg-brand-600 text-white' : 'text-ink-500 hover:text-ink-800')}
      >
        Any one can complete
      </button>
      <button
        type="button"
        onClick={() => onChange('all')}
        className={cn('rounded px-2.5 py-1 transition-colors', value === 'all' ? 'bg-brand-600 text-white' : 'text-ink-500 hover:text-ink-800')}
      >
        Everyone must complete
      </button>
    </div>
  )
}
