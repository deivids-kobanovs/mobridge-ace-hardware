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

export type LanguageCode =
  | 'en'
  | 'no'
  | 'pl'
  | 'lv'
  | 'lt'
  | 'uk'
  | 'ro'
  | 'es'
  | 'de'
  | 'sv'
  | 'da'
  | 'fi'
  | 'fr'
  | 'pt'
  | 'ar'

export interface LanguageOption {
  code: LanguageCode
  label: string
  nativeLabel: string
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'no', label: 'Norwegian', nativeLabel: 'Norsk' },
  { code: 'pl', label: 'Polish', nativeLabel: 'Polski' },
  { code: 'lv', label: 'Latvian', nativeLabel: 'Latviešu' },
  { code: 'lt', label: 'Lithuanian', nativeLabel: 'Lietuvių' },
  { code: 'uk', label: 'Ukrainian', nativeLabel: 'Українська' },
  { code: 'ro', label: 'Romanian', nativeLabel: 'Română' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español' },
  { code: 'de', label: 'German', nativeLabel: 'Deutsch' },
  { code: 'sv', label: 'Swedish', nativeLabel: 'Svenska' },
  { code: 'da', label: 'Danish', nativeLabel: 'Dansk' },
  { code: 'fi', label: 'Finnish', nativeLabel: 'Suomi' },
  { code: 'fr', label: 'French', nativeLabel: 'Français' },
  { code: 'pt', label: 'Portuguese', nativeLabel: 'Português' },
  { code: 'ar', label: 'Arabic', nativeLabel: 'العربية' },
]

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
  email: string
  preferredLanguage: LanguageCode
  interfaceLanguage?: LanguageCode
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

// ---------------------------------------------------------------------------
// Policies & Procedures
// ---------------------------------------------------------------------------

export type PolicyCategoryId =
  | 'general'
  | 'opening'
  | 'closing'
  | 'customer_service'
  | 'safety'
  | 'cleaning'
  | 'equipment'
  | 'cash_handling'
  | 'inventory'
  | 'emergency'
  | 'maintenance'
  | 'other'

export interface PolicyCategory {
  id: PolicyCategoryId | string
  companyId: string
  name: string
  sortOrder: number
  builtIn?: boolean
}

export type PolicyStatus = 'Draft' | 'Published'

export interface PolicyVersion {
  policyId: string
  version: number
  title: string
  description: string
  content: string
  summaryOfChanges?: string
  originalLanguage: LanguageCode
  publishedAt: string
  publishedBy: string
}

export interface Policy {
  id: string
  companyId: string
  locationId?: string
  title: string
  description: string
  categoryId: PolicyCategoryId | string
  content: string
  originalLanguage: LanguageCode
  status: PolicyStatus
  version: number
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
  publishedAt?: string
  requiresAcknowledgement: boolean
  archived?: boolean
  versions: PolicyVersion[]
  draftTitle?: string
  draftDescription?: string
  draftContent?: string
  draftCategoryId?: PolicyCategoryId | string
}

export interface PolicyAcknowledgement {
  id: string
  companyId: string
  policyId: string
  policyVersion: number
  employeeId: string
  acknowledgedAt: string
}

// ---------------------------------------------------------------------------
// Handbook
// ---------------------------------------------------------------------------

export type HandbookSectionStatus = 'Draft' | 'Published'

export interface HandbookSection {
  id: string
  handbookId: string
  title: string
  content: string
  sortOrder: number
  status: HandbookSectionStatus
  requiresAcknowledgement: boolean
  version: number
  updatedAt: string
  updatedBy: string
  draftTitle?: string
  draftContent?: string
}

export interface Handbook {
  companyId: string
  version: number
  originalLanguage: LanguageCode
  publishedAt: string
  updatedAt: string
  requiresFullAcknowledgement: boolean
  sections: HandbookSection[]
}

export interface HandbookAcknowledgement {
  id: string
  companyId: string
  handbookVersion: number
  employeeId: string
  acknowledgedAt: string
}

export interface HandbookSectionAcknowledgement {
  id: string
  companyId: string
  sectionId: string
  sectionVersion: number
  employeeId: string
  acknowledgedAt: string
}

// ---------------------------------------------------------------------------
// Multilingual AI translation
// ---------------------------------------------------------------------------

export type TranslationSourceType = 'policy' | 'policy_summary' | 'handbook_section' | 'task' | 'notification'

export interface TranslationEntry {
  id: string
  companyId: string
  sourceType: TranslationSourceType
  sourceId: string
  sourceVersion: number
  sourceLanguage: LanguageCode
  targetLanguage: LanguageCode
  translatedTitle?: string
  translatedContent: string
  createdAt: string
}

export interface SimulatedEmail {
  id: string
  to: string
  toEmployeeId: string
  language: LanguageCode
  subject: string
  bodyHtml: string
  sentAt: string
  relatedType: 'policy' | 'handbook'
  relatedId: string
}
