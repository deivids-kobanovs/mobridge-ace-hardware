import { makeId } from '@/lib/id'
import { addDays, todayISO } from '@/lib/date'
import type { ReminderConfig, TaskTemplate, TemplateChecklistStep } from '@/types'

export function steps(list: string[]): TemplateChecklistStep[] {
  return list.map((text) => ({ id: makeId('step'), text }))
}

export function defaultReminders(overrides: Partial<ReminderConfig> = {}): ReminderConfig {
  return {
    remindBeforeDue: true,
    remindMinutesBefore: 30,
    notifyOverdue: true,
    notifyManagerOnOverdue: true,
    repeatOverdueEvery: 60,
    escalateAfterMinutes: 120,
    escalateToManagerId: 'mgr_alex',
    ...overrides,
  }
}

const today = todayISO()

export const TEMPLATES: TaskTemplate[] = [
  {
    id: 'tpl_opening',
    name: 'Store Opening Checklist',
    description: 'Full walkthrough to get the store ready before doors open to customers.',
    department: 'Store Wide',
    estimatedDurationMinutes: 45,
    defaultPriority: 'High',
    checklist: steps([
      'Unlock designated entrances',
      'Turn on store lights',
      'Inspect emergency exits',
      'Count opening registers',
      'Check front entrance cleanliness',
      'Review overnight messages',
      'Confirm registers and customer areas are ready',
    ]),
    defaultAssignment: { type: 'employee', employeeIds: ['emp_sarah'] },
    defaultDueTime: '07:30',
    reminders: defaultReminders({ remindMinutesBefore: 15 }),
    requireApproval: true,
    requirePhoto: false,
    recurring: true,
    recurrence: {
      frequency: 'Daily',
      startDate: today,
      endType: 'never',
    },
    usageHistory: [
      { id: makeId('use'), date: addDays(today, -1), assignedTo: 'Sarah Miller', completedBy: 'Sarah Miller', completedAt: addDays(today, -1) + 'T07:24:00', status: 'Completed' },
      { id: makeId('use'), date: addDays(today, -2), assignedTo: 'Sarah Miller', completedBy: 'Sarah Miller', completedAt: addDays(today, -2) + 'T07:31:00', status: 'Completed' },
      { id: makeId('use'), date: addDays(today, -3), assignedTo: 'Mike Johnson', completedBy: 'Mike Johnson', completedAt: addDays(today, -3) + 'T07:40:00', status: 'Completed' },
      { id: makeId('use'), date: addDays(today, -4), assignedTo: 'Sarah Miller', completedBy: 'Sarah Miller', completedAt: addDays(today, -4) + 'T07:20:00', status: 'Completed' },
    ],
  },
  {
    id: 'tpl_closing',
    name: 'Store Closing Checklist',
    description: 'End-of-day checklist to secure the store and prepare for the next open.',
    department: 'Store Wide',
    estimatedDurationMinutes: 40,
    defaultPriority: 'High',
    checklist: steps([
      'Clean and organize checkout counters',
      'Return misplaced merchandise',
      'Secure outdoor displays',
      'Check emergency exits',
      'Empty designated trash containers',
      'Lock entrances',
      'Complete final store walkthrough',
      'Submit checklist for manager approval',
    ]),
    defaultAssignment: { type: 'employee', employeeIds: ['emp_carlos'] },
    defaultDueTime: '19:00',
    reminders: defaultReminders({ remindMinutesBefore: 30 }),
    requireApproval: true,
    requirePhoto: true,
    recurring: true,
    recurrence: {
      frequency: 'Daily',
      startDate: today,
      endType: 'never',
    },
    usageHistory: [
      { id: makeId('use'), date: addDays(today, -1), assignedTo: 'Carlos Nunez', completedBy: 'Carlos Nunez', completedAt: addDays(today, -1) + 'T19:12:00', status: 'Completed' },
      { id: makeId('use'), date: addDays(today, -2), assignedTo: 'Emily Davis', completedBy: 'Emily Davis', completedAt: addDays(today, -2) + 'T19:35:00', status: 'Returned for Correction' },
      { id: makeId('use'), date: addDays(today, -3), assignedTo: 'Carlos Nunez', completedBy: 'Carlos Nunez', completedAt: addDays(today, -3) + 'T19:05:00', status: 'Completed' },
    ],
  },
  {
    id: 'tpl_garden_opening',
    name: 'Garden Center Opening',
    description: 'Prepare the outdoor garden center for the day, including plant care checks.',
    department: 'Lawn & Garden',
    estimatedDurationMinutes: 30,
    defaultPriority: 'Normal',
    checklist: steps([
      'Unlock garden center gate',
      'Water plants along the front row',
      'Check overnight weather damage',
      'Restock soil and mulch bags',
      'Set out seasonal display signage',
      'Inspect irrigation timers',
    ]),
    defaultAssignment: { type: 'employee', employeeIds: ['emp_emily'] },
    defaultDueTime: '08:15',
    reminders: defaultReminders({ remindMinutesBefore: 15 }),
    requireApproval: false,
    requirePhoto: false,
    recurring: true,
    recurrence: {
      frequency: 'Daily',
      startDate: today,
      endType: 'never',
    },
    usageHistory: [
      { id: makeId('use'), date: addDays(today, -1), assignedTo: 'Emily Davis', completedBy: 'Emily Davis', completedAt: addDays(today, -1) + 'T08:05:00', status: 'Completed' },
      { id: makeId('use'), date: addDays(today, -2), assignedTo: 'Emily Davis', completedBy: 'Emily Davis', completedAt: addDays(today, -2) + 'T08:20:00', status: 'Completed' },
    ],
  },
  {
    id: 'tpl_receiving',
    name: 'Receiving Delivery Checklist',
    description: 'Check in and stage incoming vendor deliveries against the manifest.',
    department: 'Receiving',
    estimatedDurationMinutes: 60,
    defaultPriority: 'High',
    checklist: steps([
      'Verify delivery against packing slip',
      'Inspect for damaged goods',
      'Unload pallets to staging area',
      'Scan items into inventory system',
      'Flag shortages or overages',
      'File paperwork in receiving binder',
    ]),
    defaultAssignment: { type: 'employee', employeeIds: ['emp_mike'] },
    defaultDueTime: '09:00',
    reminders: defaultReminders({ remindMinutesBefore: 60, escalateAfterMinutes: 90 }),
    requireApproval: true,
    requirePhoto: true,
    recurring: true,
    recurrence: {
      frequency: 'Weekdays',
      startDate: today,
      endType: 'never',
    },
    usageHistory: [
      { id: makeId('use'), date: addDays(today, -1), assignedTo: 'Mike Johnson', completedBy: 'Mike Johnson', completedAt: addDays(today, -1) + 'T10:10:00', status: 'Completed' },
      { id: makeId('use'), date: addDays(today, -4), assignedTo: 'Mike Johnson', status: 'Blocked' },
    ],
  },
  {
    id: 'tpl_safety',
    name: 'Weekly Safety Inspection',
    description: 'Walk the sales floor and stockroom to catch safety hazards before they become incidents.',
    department: 'Store Wide',
    estimatedDurationMinutes: 35,
    defaultPriority: 'Normal',
    checklist: steps([
      'Check fire extinguisher tags',
      'Inspect aisles for blocked exits',
      'Test emergency lighting',
      'Check ladder and lift equipment condition',
      'Review chemical storage compliance',
      'Log any hazards found and follow-up needed',
    ]),
    defaultAssignment: { type: 'department', employeeIds: [], department: 'Store Wide' },
    defaultDueTime: '11:00',
    reminders: defaultReminders({ remindMinutesBefore: 60 }),
    requireApproval: true,
    requirePhoto: false,
    recurring: true,
    recurrence: {
      frequency: 'Weekly',
      daysOfWeek: [1],
      startDate: today,
      endType: 'never',
    },
    usageHistory: [
      { id: makeId('use'), date: addDays(today, -7), assignedTo: 'Jordan Lee', completedBy: 'Jordan Lee', completedAt: addDays(today, -7) + 'T11:20:00', status: 'Completed' },
      { id: makeId('use'), date: addDays(today, -14), assignedTo: 'Priya Patel', completedBy: 'Priya Patel', completedAt: addDays(today, -14) + 'T11:40:00', status: 'Completed' },
    ],
  },
]
