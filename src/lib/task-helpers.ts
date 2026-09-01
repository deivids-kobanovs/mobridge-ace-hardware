import { combineToDate } from '@/lib/date'
import type { Task, TaskStatus } from '@/types'

export function effectiveStatus(task: Task, now: Date = new Date()): TaskStatus {
  if (task.status === 'Not Started' || task.status === 'In Progress') {
    if (combineToDate(task.dueDate, task.dueTime).getTime() < now.getTime()) {
      return 'Overdue'
    }
  }
  return task.status
}

export function isOverdue(task: Task, now: Date = new Date()): boolean {
  return effectiveStatus(task, now) === 'Overdue'
}

export function isActive(task: Task): boolean {
  return !['Completed', 'Cancelled'].includes(task.status)
}

export function checklistProgress(task: Task): { done: number; total: number } {
  return { done: task.checklist.filter((c) => c.done).length, total: task.checklist.length }
}

export function isAssignedTo(task: Task, employeeId: string): boolean {
  if (task.assignment.type === 'unassigned') return false
  if (task.assignment.type === 'department') return false
  return task.assignment.employeeIds.includes(employeeId)
}

export function tasksAssignedToday(tasks: Task[], employeeId: string, todayIso: string): Task[] {
  return tasks.filter((t) => isAssignedTo(t, employeeId) && t.dueDate === todayIso && isActive(t))
}

export interface TaskFilterState {
  status: string
  employeeId: string
  department: string
  priority: string
  recurring: string
  approval: string
}

export function matchesFilters(task: Task, filters: TaskFilterState, now: Date = new Date()): boolean {
  if (filters.status !== 'All' && effectiveStatus(task, now) !== filters.status) return false
  if (filters.employeeId !== 'All' && !isAssignedTo(task, filters.employeeId)) return false
  if (filters.department !== 'All' && task.department !== filters.department) return false
  if (filters.priority !== 'All' && task.priority !== filters.priority) return false
  if (filters.recurring === 'Recurring' && !task.recurring) return false
  if (filters.recurring === 'One-time' && task.recurring) return false
  if (filters.approval === 'Required' && !task.requireApproval) return false
  if (filters.approval === 'Not required' && task.requireApproval) return false
  return true
}

export interface DashboardSummary {
  dueToday: number
  completedToday: number
  remaining: number
  overdue: number
  blocked: number
  awaitingApproval: number
  completionPercent: number
}

export function computeSummary(tasks: Task[], todayIso: string, now: Date = new Date()): DashboardSummary {
  const todayTasks = tasks.filter((t) => t.dueDate === todayIso && t.status !== 'Cancelled')
  const completedToday = todayTasks.filter((t) => t.status === 'Completed').length
  const overdue = tasks.filter((t) => isOverdue(t, now)).length
  const blocked = tasks.filter((t) => t.status === 'Blocked').length
  const awaitingApproval = tasks.filter((t) => t.status === 'Awaiting Approval').length
  const remaining = todayTasks.filter((t) => !['Completed'].includes(t.status)).length
  const completionPercent = todayTasks.length > 0 ? Math.round((completedToday / todayTasks.length) * 100) : 0
  return { dueToday: todayTasks.length, completedToday, remaining, overdue, blocked, awaitingApproval, completionPercent }
}

export function matchesSearch(task: Task, query: string, nameLookup: (id: string) => string): boolean {
  if (!query.trim()) return true
  const q = query.toLowerCase()
  const assignees = task.assignment.type === 'employee' || task.assignment.type === 'multiple' ? task.assignment.employeeIds.map(nameLookup) : []
  return (
    task.title.toLowerCase().includes(q) ||
    task.description.toLowerCase().includes(q) ||
    task.department.toLowerCase().includes(q) ||
    assignees.some((n) => n.toLowerCase().includes(q))
  )
}

export function recurrenceSummary(task: Pick<Task, 'recurrence'>): string {
  const r = task.recurrence
  if (!r) return 'Does not repeat'
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  let base = ''
  switch (r.frequency) {
    case 'Daily':
      base = 'Repeats every day'
      break
    case 'Weekdays':
      base = 'Repeats every weekday (Mon–Fri)'
      break
    case 'Weekly':
      base = r.daysOfWeek?.length
        ? `Repeats weekly on ${r.daysOfWeek.map((d) => dayNames[d]).join(' and ')}`
        : 'Repeats every week'
      break
    case 'Every 2 Weeks':
      base = r.daysOfWeek?.length
        ? `Repeats every 2 weeks on ${r.daysOfWeek.map((d) => dayNames[d]).join(' and ')}`
        : 'Repeats every 2 weeks'
      break
    case 'Monthly':
      base = r.dayOfMonth ? `Repeats monthly on day ${r.dayOfMonth}` : 'Repeats every month'
      break
    case 'Quarterly':
      base = 'Repeats every quarter'
      break
    case 'Yearly':
      base = 'Repeats every year'
      break
    case 'Custom': {
      const unit = r.intervalUnit ?? 'weeks'
      const n = r.interval ?? 1
      base = `Repeats every ${n} ${n === 1 ? unit.slice(0, -1) : unit}`
      if (r.daysOfWeek?.length) base += ` on ${r.daysOfWeek.map((d) => dayNames[d]).join(' and ')}`
      if (r.dayOfMonth) base += ` on day ${r.dayOfMonth}`
      break
    }
  }
  const [y, m, d] = r.startDate.split('-').map(Number)
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  base += `, beginning ${months[m - 1]} ${d}${y ? '' : ''}`
  if (r.endType === 'onDate' && r.endDate) {
    const [ey, em, ed] = r.endDate.split('-').map(Number)
    void ey
    base += `, until ${months[em - 1]} ${ed}`
  } else if (r.endType === 'afterOccurrences' && r.occurrences) {
    base += `, for ${r.occurrences} occurrences`
  }
  return base + '.'
}

export function assignmentLabel(task: Pick<Task, 'assignment'>, nameLookup: (id: string) => string): string {
  const a = task.assignment
  if (a.type === 'unassigned') return 'Unassigned'
  if (a.type === 'department') return `${a.department ?? 'Team'} team`
  if (a.type === 'employee') return nameLookup(a.employeeIds[0])
  return `${a.employeeIds.map(nameLookup).join(', ')} (${a.completionMode === 'all' ? 'all must complete' : 'any can complete'})`
}
