import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { EMPLOYEES } from '@/data/employees'
import type { TaskFilterState } from '@/lib/task-helpers'
import { DEPARTMENTS, PRIORITIES, TASK_STATUSES } from '@/types'

export const DEFAULT_FILTERS: TaskFilterState = {
  status: 'All',
  employeeId: 'All',
  department: 'All',
  priority: 'All',
  recurring: 'All',
  approval: 'All',
}

export function TaskFilters({ value, onChange }: { value: TaskFilterState; onChange: (v: TaskFilterState) => void }) {
  const active = Object.entries(value).filter(([, v]) => v !== 'All').length

  return (
    <div className="flex flex-wrap items-center gap-2">
      <FilterSelect label="Status" value={value.status} onChange={(v) => onChange({ ...value, status: v })} options={['All', ...TASK_STATUSES]} />
      <FilterSelect label="Employee" value={value.employeeId} onChange={(v) => onChange({ ...value, employeeId: v })} options={['All', ...EMPLOYEES.map((e) => e.id)]} labels={{ All: 'All employees', ...Object.fromEntries(EMPLOYEES.map((e) => [e.id, e.name])) }} />
      <FilterSelect label="Department" value={value.department} onChange={(v) => onChange({ ...value, department: v })} options={['All', ...DEPARTMENTS]} />
      <FilterSelect label="Priority" value={value.priority} onChange={(v) => onChange({ ...value, priority: v })} options={['All', ...PRIORITIES]} />
      <FilterSelect label="Type" value={value.recurring} onChange={(v) => onChange({ ...value, recurring: v })} options={['All', 'Recurring', 'One-time']} />
      <FilterSelect label="Approval" value={value.approval} onChange={(v) => onChange({ ...value, approval: v })} options={['All', 'Required', 'Not required']} />
      {active > 0 && (
        <Button variant="ghost" size="sm" onClick={() => onChange(DEFAULT_FILTERS)}>
          <X className="size-3.5" />
          Clear ({active})
        </Button>
      )}
    </div>
  )
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  labels,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: string[]
  labels?: Record<string, string>
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-9 w-auto min-w-[9rem] bg-card text-xs">
        <span className="mr-1 text-ink-400">{label}:</span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o} value={o}>
            {labels?.[o] ?? (o === 'All' ? `All ${label.toLowerCase()}` : o)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
