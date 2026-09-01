export type Role = 'manager' | 'employee'

export type Department =
  | 'Front End'
  | 'Hardware'
  | 'Paint'
  | 'Plumbing & Electrical'
  | 'Lawn & Garden'
  | 'Receiving'
  | 'Store Wide'

export const DEPARTMENTS: Department[] = [
  'Front End',
  'Hardware',
  'Paint',
  'Plumbing & Electrical',
  'Lawn & Garden',
  'Receiving',
  'Store Wide',
]

export type Priority = 'Low' | 'Normal' | 'High' | 'Urgent'
export const PRIORITIES: Priority[] = ['Low', 'Normal', 'High', 'Urgent']

export type TaskStatus =
  | 'Not Started'
  | 'In Progress'
  | 'Blocked'
  | 'Awaiting Approval'
  | 'Completed'
  | 'Overdue'
  | 'Returned for Correction'
  | 'Cancelled'

export const TASK_STATUSES: TaskStatus[] = [
  'Not Started',
  'In Progress',
  'Blocked',
  'Awaiting Approval',
  'Completed',
  'Overdue',
  'Returned for Correction',
]

export type RecurrenceFrequency =
  | 'Daily'
  | 'Weekdays'
  | 'Weekly'
  | 'Every 2 Weeks'
  | 'Monthly'
  | 'Quarterly'
  | 'Yearly'
  | 'Custom'

export interface RecurrenceConfig {
  frequency: RecurrenceFrequency
  interval?: number
  intervalUnit?: 'days' | 'weeks' | 'months' | 'years'
  daysOfWeek?: number[] // 0=Sun .. 6=Sat
  dayOfMonth?: number
  startDate: string
  endType: 'never' | 'onDate' | 'afterOccurrences'
  endDate?: string
  occurrences?: number
}

export type AssignmentType = 'employee' | 'multiple' | 'department' | 'unassigned'
export type CompletionMode = 'all' | 'any'

export interface Assignment {
  type: AssignmentType
  employeeIds: string[]
  department?: Department
  completionMode?: CompletionMode
}

export interface ReminderConfig {
  remindBeforeDue: boolean
  remindMinutesBefore: number
  notifyOverdue: boolean
  notifyManagerOnOverdue: boolean
  repeatOverdueEvery?: number
  escalateAfterMinutes?: number
  escalateToManagerId?: string
}

export interface ChecklistItem {
  id: string
  text: string
  done: boolean
  doneBy?: string
  doneAt?: string
}

export type BlockReasonCategory =
  | 'Missing supplies'
  | 'Equipment unavailable or broken'
  | 'Waiting for another employee'
  | 'Customer activity preventing completion'
  | 'Safety concern'
  | 'Instructions are unclear'
  | 'Manager assistance needed'
  | 'Other'

export const BLOCK_REASONS: BlockReasonCategory[] = [
  'Missing supplies',
  'Equipment unavailable or broken',
  'Waiting for another employee',
  'Customer activity preventing completion',
  'Safety concern',
  'Instructions are unclear',
  'Manager assistance needed',
  'Other',
]

export interface BlockInfo {
  reason: BlockReasonCategory
  explanation: string
  photo: boolean
  reportedBy: string
  reportedAt: string
  resolved: boolean
  resolvedAt?: string
  resolvedBy?: string
  resolutionNote?: string
}

export interface CancelInfo {
  reason: string
  by: string
  at: string
}

export type ActivityType =
  | 'created'
  | 'assigned'
  | 'reassigned'
  | 'status'
  | 'reminder'
  | 'overdue'
  | 'escalated'
  | 'blocked'
  | 'unblocked'
  | 'note'
  | 'submitted'
  | 'approved'
  | 'returned'
  | 'completed'
  | 'cancelled'
  | 'rescheduled'
  | 'message'

export interface ActivityEntry {
  id: string
  timestamp: string
  type: ActivityType
  actor: string
  message: string
}

export interface Task {
  id: string
  title: string
  description: string
  department: Department
  priority: Priority
  status: TaskStatus
  startDate: string
  dueDate: string
  dueTime: string
  estimatedDurationMinutes: number
  checklist: ChecklistItem[]
  managerNotes?: string
  referenceAttachment?: string
  requirePhoto: boolean
  requireApproval: boolean
  recurring: boolean
  recurrence?: RecurrenceConfig
  assignment: Assignment
  reminders: ReminderConfig
  createdBy: string
  createdAt: string
  templateId?: string
  templateName?: string

  completedBy?: string
  completedAt?: string
  completionNote?: string
  completionPhoto?: boolean

  approvedBy?: string
  approvedAt?: string

  returnedReason?: string
  returnedBy?: string
  returnedAt?: string

  blocked?: BlockInfo
  cancelled?: CancelInfo

  activity: ActivityEntry[]
}

export type ShiftStatus = 'On Shift' | 'On Break' | 'Off Shift'

export interface Employee {
  id: string
  name: string
  role: string
  department: Department
  shiftLabel: string
  shiftStatus: ShiftStatus
  initials: string
  color: string
  isManager?: boolean
}

export interface TemplateChecklistStep {
  id: string
  text: string
}

export interface TemplateUsage {
  id: string
  date: string
  assignedTo: string
  completedBy?: string
  completedAt?: string
  status: TaskStatus
}

export interface TaskTemplate {
  id: string
  name: string
  description: string
  department: Department
  estimatedDurationMinutes: number
  defaultPriority: Priority
  checklist: TemplateChecklistStep[]
  defaultAssignment: Assignment
  defaultDueTime: string
  reminders: ReminderConfig
  requireApproval: boolean
  requirePhoto: boolean
  recurring: boolean
  recurrence?: RecurrenceConfig
  usageHistory: TemplateUsage[]
}

export type NotificationType =
  | 'reminder'
  | 'overdue'
  | 'escalation'
  | 'approval_request'
  | 'blocked'
  | 'returned'
  | 'approved'
  | 'info'

export interface AppNotification {
  id: string
  timestamp: string
  title: string
  message: string
  type: NotificationType
  read: boolean
  targetRole: Role
  employeeId?: string
  taskId?: string
}

export interface Announcement {
  id: string
  timestamp: string
  author: string
  message: string
}
