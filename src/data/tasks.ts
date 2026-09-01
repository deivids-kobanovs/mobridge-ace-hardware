import { makeId } from '@/lib/id'
import { addDays, timeString, todayISO } from '@/lib/date'
import { defaultReminders } from '@/data/templates'
import type { ActivityEntry, ActivityType, Assignment, ChecklistItem, ReminderConfig, Task, TaskStatus } from '@/types'

const today = todayISO()
const yesterday = addDays(today, -1)
const tomorrow = addDays(today, 1)
const now = new Date()
const curHour = now.getHours()

function laterToday(hoursFromNow: number): string {
  return timeString(Math.min(curHour + hoursFromNow, 23), curHour + hoursFromNow >= 24 ? 45 : now.getMinutes())
}

function act(type: ActivityType, actor: string, message: string, minutesAgo = 0): ActivityEntry {
  return {
    id: makeId('act'),
    timestamp: new Date(now.getTime() - minutesAgo * 60000).toISOString(),
    type,
    actor,
    message,
  }
}

function checklist(items: Array<[string, boolean, string?, string?]>): ChecklistItem[] {
  return items.map(([text, done, doneBy, doneAt]) => ({
    id: makeId('chk'),
    text,
    done,
    doneBy,
    doneAt,
  }))
}

function assign(employeeIds: string[], completionMode?: 'all' | 'any'): Assignment {
  return { type: employeeIds.length > 1 ? 'multiple' : 'employee', employeeIds, completionMode }
}

function unassigned(department: Task['department']): Assignment {
  return { type: 'department', employeeIds: [], department }
}

function reminders(overrides: Partial<ReminderConfig> = {}): ReminderConfig {
  return defaultReminders(overrides)
}

let seq = 0
function base(partial: Partial<Task> & Pick<Task, 'title' | 'description' | 'department' | 'priority' | 'status' | 'dueDate' | 'dueTime' | 'assignment'>): Task {
  seq += 1
  return {
    id: makeId('task'),
    startDate: today,
    estimatedDurationMinutes: 30,
    checklist: [],
    requirePhoto: false,
    requireApproval: false,
    recurring: false,
    reminders: reminders(),
    createdBy: 'Alex Rivera',
    createdAt: new Date(now.getTime() - (48 - seq) * 3600000).toISOString(),
    activity: [act('created', 'Alex Rivera', 'Task created.', 60 * 6)],
    ...partial,
  }
}

export const SEED_TASKS: Task[] = [
  base({
    title: 'Store Opening Checklist',
    description: 'Complete the full opening walkthrough before doors open to customers.',
    department: 'Store Wide',
    priority: 'High',
    status: 'Completed',
    dueDate: today,
    dueTime: '07:30',
    estimatedDurationMinutes: 45,
    assignment: assign(['emp_sarah']),
    requireApproval: true,
    recurring: true,
    recurrence: { frequency: 'Daily', startDate: today, endType: 'never' },
    templateId: 'tpl_opening',
    templateName: 'Store Opening Checklist',
    checklist: checklist([
      ['Unlock designated entrances', true, 'Sarah Miller', '7:02 AM'],
      ['Turn on store lights', true, 'Sarah Miller', '7:04 AM'],
      ['Inspect emergency exits', true, 'Sarah Miller', '7:09 AM'],
      ['Count opening registers', true, 'Sarah Miller', '7:14 AM'],
      ['Check front entrance cleanliness', true, 'Sarah Miller', '7:18 AM'],
      ['Review overnight messages', true, 'Sarah Miller', '7:20 AM'],
      ['Confirm registers and customer areas are ready', true, 'Sarah Miller', '7:24 AM'],
    ]),
    completedBy: 'Sarah Miller',
    completedAt: new Date(now.getTime() - 200 * 60000).toISOString(),
    completionNote: 'Everything ready, overnight note said aisle 4 endcap needs restocking.',
    approvedBy: 'Alex Rivera',
    approvedAt: new Date(now.getTime() - 180 * 60000).toISOString(),
    activity: [
      act('created', 'Alex Rivera', 'Recurring task auto-assigned to Sarah Miller for today.', 260),
      act('status', 'Sarah Miller', 'Marked "Store Opening Checklist" as In Progress.', 245),
      act('completed', 'Sarah Miller', 'Completed all checklist steps and submitted for approval.', 205),
      act('submitted', 'Sarah Miller', 'Submitted "Store Opening Checklist" for manager approval.', 205),
      act('approved', 'Alex Rivera', 'Approved the store-opening checklist.', 180),
    ],
  }),

  base({
    title: 'Check paint tinting supplies',
    description: 'Verify tint colorant levels and reorder any bases running low before the weekend rush.',
    department: 'Paint',
    priority: 'Normal',
    status: 'In Progress',
    dueDate: today,
    dueTime: laterToday(3),
    estimatedDurationMinutes: 25,
    assignment: assign(['emp_jordan']),
    checklist: checklist([
      ['Check colorant cartridge levels', true, 'Jordan Lee', '9:40 AM'],
      ['Inspect tint machine nozzles', false],
      ['Count base paint gallons in stock', false],
      ['Note reorder needs on supply sheet', false],
    ]),
    activity: [
      act('created', 'Alex Rivera', 'Task created and assigned to Jordan Lee.', 180),
      act('status', 'Jordan Lee', 'Marked "Check paint tinting supplies" as In Progress.', 40),
    ],
  }),

  base({
    title: 'Unload morning delivery',
    description: 'Unload the vendor delivery truck and stage pallets in the receiving bay.',
    department: 'Receiving',
    priority: 'High',
    status: 'Blocked',
    dueDate: today,
    dueTime: '09:00',
    estimatedDurationMinutes: 60,
    assignment: assign(['emp_mike']),
    requirePhoto: true,
    requireApproval: true,
    templateId: 'tpl_receiving',
    templateName: 'Receiving Delivery Checklist',
    checklist: checklist([
      ['Verify delivery against packing slip', true, 'Mike Johnson', '8:15 AM'],
      ['Inspect for damaged goods', true, 'Mike Johnson', '8:22 AM'],
      ['Unload pallets to staging area', false],
      ['Scan items into inventory system', false],
      ['Flag shortages or overages', false],
      ['File paperwork in receiving binder', false],
    ]),
    blocked: {
      reason: 'Equipment unavailable or broken',
      explanation: 'The pallet jack is jammed and the backup unit is being serviced. Cannot move pallets off the truck safely.',
      photo: true,
      reportedBy: 'Mike Johnson',
      reportedAt: new Date(now.getTime() - 35 * 60000).toISOString(),
      resolved: false,
    },
    activity: [
      act('created', 'Alex Rivera', 'Task created and assigned to Mike Johnson.', 240),
      act('status', 'Mike Johnson', 'Marked "Unload morning delivery" as In Progress.', 100),
      act('blocked', 'Mike Johnson', 'Reported blocked: Equipment unavailable or broken — pallet jack is jammed.', 35),
    ],
  }),

  base({
    title: 'Garden Center Opening',
    description: 'Water the front row plants and prep the garden center for customers.',
    department: 'Lawn & Garden',
    priority: 'Normal',
    status: 'Completed',
    dueDate: today,
    dueTime: '08:15',
    estimatedDurationMinutes: 30,
    assignment: assign(['emp_emily']),
    templateId: 'tpl_garden_opening',
    templateName: 'Garden Center Opening',
    checklist: checklist([
      ['Unlock garden center gate', true, 'Emily Davis', '8:00 AM'],
      ['Water plants along the front row', true, 'Emily Davis', '8:06 AM'],
      ['Check overnight weather damage', true, 'Emily Davis', '8:09 AM'],
      ['Restock soil and mulch bags', true, 'Emily Davis', '8:14 AM'],
      ['Set out seasonal display signage', true, 'Emily Davis', '8:18 AM'],
      ['Inspect irrigation timers', true, 'Emily Davis', '8:20 AM'],
    ]),
    completedBy: 'Emily Davis',
    completedAt: new Date(now.getTime() - 260 * 60000).toISOString(),
    activity: [
      act('created', 'Alex Rivera', 'Recurring task auto-assigned to Emily Davis.', 300),
      act('completed', 'Emily Davis', 'Completed "Garden Center Opening".', 260),
    ],
  }),

  base({
    title: 'Front entrance cleaning',
    description: 'Sweep and mop the front entrance mats and glass doors.',
    department: 'Front End',
    priority: 'Normal',
    status: 'Not Started',
    dueDate: yesterday,
    dueTime: '16:00',
    estimatedDurationMinutes: 20,
    assignment: assign(['emp_sarah']),
    activity: [act('created', 'Alex Rivera', 'Task created and assigned to Sarah Miller.', 60 * 20)],
  }),

  base({
    title: 'Receiving checklist',
    description: 'Log yesterday\'s vendor receipts and reconcile against purchase orders.',
    department: 'Receiving',
    priority: 'High',
    status: 'Not Started',
    dueDate: yesterday,
    dueTime: '14:00',
    estimatedDurationMinutes: 45,
    assignment: assign(['emp_mike']),
    requireApproval: true,
    reminders: reminders({ escalateAfterMinutes: 120, escalateToManagerId: 'mgr_dana' }),
    activity: [
      act('created', 'Alex Rivera', 'Task created and assigned to Mike Johnson.', 60 * 22),
      act('overdue', 'System', 'Receiving checklist is now overdue.', 60 * 4),
      act('escalated', 'System', 'Receiving checklist has been overdue for 2 hours and was escalated to Dana Whitfield.', 60 * 2),
    ],
  }),

  base({
    title: 'Restock endcap displays',
    description: 'Refill the seasonal endcap displays near the main aisle using the planogram.',
    department: 'Hardware',
    priority: 'Low',
    status: 'Not Started',
    dueDate: tomorrow,
    dueTime: '10:00',
    estimatedDurationMinutes: 30,
    assignment: unassigned('Hardware'),
    activity: [act('created', 'Alex Rivera', 'Task created, left unassigned for the Hardware team.', 90)],
  }),

  base({
    title: 'Weekly Safety Inspection',
    description: 'Walk the sales floor and stockroom checking for hazards.',
    department: 'Store Wide',
    priority: 'Normal',
    status: 'Awaiting Approval',
    dueDate: today,
    dueTime: '11:00',
    estimatedDurationMinutes: 35,
    assignment: assign(['emp_jordan']),
    requireApproval: true,
    templateId: 'tpl_safety',
    templateName: 'Weekly Safety Inspection',
    recurring: true,
    recurrence: { frequency: 'Weekly', daysOfWeek: [1], startDate: today, endType: 'never' },
    checklist: checklist([
      ['Check fire extinguisher tags', true, 'Jordan Lee', '11:05 AM'],
      ['Inspect aisles for blocked exits', true, 'Jordan Lee', '11:10 AM'],
      ['Test emergency lighting', true, 'Jordan Lee', '11:15 AM'],
      ['Check ladder and lift equipment condition', true, 'Jordan Lee', '11:22 AM'],
      ['Review chemical storage compliance', true, 'Jordan Lee', '11:28 AM'],
      ['Log any hazards found and follow-up needed', true, 'Jordan Lee', '11:30 AM'],
    ]),
    completionNote: 'Found one flickering emergency light near the stockroom exit — logged for facilities.',
    completedBy: 'Jordan Lee',
    completedAt: new Date(now.getTime() - 15 * 60000).toISOString(),
    activity: [
      act('created', 'Alex Rivera', 'Weekly recurring inspection auto-assigned to Jordan Lee.', 100),
      act('submitted', 'Jordan Lee', 'Submitted "Weekly Safety Inspection" for manager approval.', 15),
    ],
  }),

  base({
    title: 'Store Closing Checklist',
    description: 'Secure the store and prep for tomorrow\'s open.',
    department: 'Store Wide',
    priority: 'High',
    status: 'Not Started',
    dueDate: today,
    dueTime: '19:00',
    estimatedDurationMinutes: 40,
    assignment: assign(['emp_carlos']),
    requireApproval: true,
    requirePhoto: true,
    templateId: 'tpl_closing',
    templateName: 'Store Closing Checklist',
    recurring: true,
    recurrence: { frequency: 'Daily', startDate: today, endType: 'never' },
    checklist: checklist([
      ['Clean and organize checkout counters', false],
      ['Return misplaced merchandise', false],
      ['Secure outdoor displays', false],
      ['Check emergency exits', false],
      ['Empty designated trash containers', false],
      ['Lock entrances', false],
      ['Complete final store walkthrough', false],
      ['Submit checklist for manager approval', false],
    ]),
    activity: [act('created', 'Alex Rivera', 'Recurring closing checklist auto-assigned to Carlos Nunez.', 200)],
  }),

  base({
    title: 'Return misplaced merchandise scan',
    description: 'Walk the floor and return abandoned/misplaced items to their correct shelf location.',
    department: 'Front End',
    priority: 'Normal',
    status: 'Returned for Correction',
    dueDate: yesterday,
    dueTime: '18:00',
    estimatedDurationMinutes: 25,
    assignment: assign(['emp_emily']),
    requireApproval: true,
    checklist: checklist([
      ['Check checkout lanes for abandoned items', true, 'Emily Davis', 'Yesterday'],
      ['Return items to correct aisles', true, 'Emily Davis', 'Yesterday'],
      ['Tidy endcaps near entrance', true, 'Emily Davis', 'Yesterday'],
    ]),
    completedBy: 'Emily Davis',
    completedAt: new Date(now.getTime() - 60 * 22 * 60000).toISOString(),
    returnedReason: 'A cart of returned paint cans was left in the aisle 6 endcap — please finish putting those away before resubmitting.',
    returnedBy: 'Alex Rivera',
    returnedAt: new Date(now.getTime() - 60 * 20 * 60000).toISOString(),
    activity: [
      act('created', 'Alex Rivera', 'Task created and assigned to Emily Davis.', 60 * 26),
      act('submitted', 'Emily Davis', 'Submitted "Return misplaced merchandise scan" for approval.', 60 * 22),
      act('returned', 'Alex Rivera', 'Returned for correction: paint cans left in aisle 6 endcap.', 60 * 20),
    ],
  }),

  base({
    title: 'Paint mixing station cleanup',
    description: 'Deep clean the mixing station and dispose of empty cans per policy.',
    department: 'Paint',
    priority: 'Low',
    status: 'Not Started',
    dueDate: tomorrow,
    dueTime: '10:30',
    estimatedDurationMinutes: 20,
    assignment: assign(['emp_jordan']),
    activity: [act('created', 'Alex Rivera', 'Task created and assigned to Jordan Lee.', 45)],
  }),

  base({
    title: 'Price tag audit — aisle 12',
    description: 'Confirm shelf tags match current pricing for plumbing fittings in aisle 12.',
    department: 'Plumbing & Electrical',
    priority: 'Low',
    status: 'Not Started',
    dueDate: addDays(today, 2),
    dueTime: '13:00',
    estimatedDurationMinutes: 30,
    assignment: assign(['emp_priya']),
    activity: [act('created', 'Alex Rivera', 'Task created and assigned to Priya Patel.', 30)],
  }),

  base({
    title: 'Seasonal aisle reset',
    description: 'Reset the seasonal aisle to the new fall planogram. Either associate can complete it.',
    department: 'Store Wide',
    priority: 'Normal',
    status: 'Not Started',
    dueDate: tomorrow,
    dueTime: '12:00',
    estimatedDurationMinutes: 50,
    assignment: assign(['emp_sarah', 'emp_carlos'], 'any'),
    activity: [act('created', 'Alex Rivera', 'Task created and assigned to Sarah Miller and Carlos Nunez (either can complete).', 70)],
  }),

  base({
    title: 'Full store restock walk',
    description: 'Every department associate checks their section for restock needs before the evening rush.',
    department: 'Store Wide',
    priority: 'Normal',
    status: 'Not Started',
    dueDate: today,
    dueTime: laterToday(4),
    estimatedDurationMinutes: 20,
    assignment: assign(['emp_sarah', 'emp_mike', 'emp_emily'], 'all'),
    activity: [act('created', 'Alex Rivera', 'Task created — all three assigned associates must complete it.', 90)],
  }),

  base({
    title: 'Inspect ladder equipment',
    description: 'Check all warehouse ladders for structural issues before use today.',
    department: 'Hardware',
    priority: 'High',
    status: 'Blocked',
    dueDate: today,
    dueTime: '09:30',
    estimatedDurationMinutes: 15,
    assignment: assign(['emp_carlos']),
    checklist: checklist([
      ['Check rungs and rails for damage', true, 'Carlos Nunez', '9:20 AM'],
      ['Test locking mechanisms', false],
      ['Tag any ladder needing repair', false],
    ]),
    blocked: {
      reason: 'Safety concern',
      explanation: 'The tall warehouse ladder has a cracked rail. Pulled it from service but need a manager sign-off before continuing the rest of the inspection.',
      photo: true,
      reportedBy: 'Carlos Nunez',
      reportedAt: new Date(now.getTime() - 18 * 60000).toISOString(),
      resolved: false,
    },
    activity: [
      act('created', 'Alex Rivera', 'Task created and assigned to Carlos Nunez.', 120),
      act('blocked', 'Carlos Nunez', 'Reported blocked: Safety concern — cracked rail on warehouse ladder.', 18),
    ],
  }),

  base({
    title: 'Clean up spill in aisle 7',
    description: 'Customer reported a spilled bag of ice melt in aisle 7. Clean up immediately and place a wet floor sign.',
    department: 'Front End',
    priority: 'Urgent',
    status: 'In Progress',
    dueDate: today,
    dueTime: timeString(curHour, Math.min(now.getMinutes() + 20, 59)),
    estimatedDurationMinutes: 10,
    assignment: assign(['emp_sarah']),
    reminders: reminders({ remindMinutesBefore: 15, escalateAfterMinutes: 30 }),
    checklist: checklist([
      ['Place wet floor sign', true, 'Sarah Miller', 'Just now'],
      ['Sweep and clean spilled product', false],
      ['Restock shelf from backstock', false],
    ]),
    activity: [
      act('created', 'Alex Rivera', 'Urgent task created and assigned to Sarah Miller.', 8),
      act('status', 'Sarah Miller', 'Marked "Clean up spill in aisle 7" as In Progress.', 5),
    ],
  }),

  base({
    title: 'Organize seasonal clearance shelf',
    description: 'Consolidate clearance items and update signage for the seasonal shelf near Garden Center.',
    department: 'Plumbing & Electrical',
    priority: 'Low',
    status: 'Not Started',
    dueDate: addDays(today, 3),
    dueTime: '14:00',
    estimatedDurationMinutes: 25,
    assignment: assign(['emp_priya']),
    activity: [act('created', 'Alex Rivera', 'Task created and assigned to Priya Patel.', 20)],
  }),

  base({
    title: 'Restock endcap during promo event',
    description: 'Keep the weekend promo endcap stocked through the sale event.',
    department: 'Front End',
    priority: 'Normal',
    status: 'Blocked',
    dueDate: today,
    dueTime: '13:00',
    estimatedDurationMinutes: 20,
    assignment: assign(['emp_sarah']),
    blocked: {
      reason: 'Customer activity preventing completion',
      explanation: 'The endcap is packed with customers browsing the promo — can\'t safely restock until it clears out a bit.',
      photo: false,
      reportedBy: 'Sarah Miller',
      reportedAt: new Date(now.getTime() - 12 * 60000).toISOString(),
      resolved: false,
    },
    activity: [
      act('created', 'Alex Rivera', 'Task created and assigned to Sarah Miller.', 100),
      act('blocked', 'Sarah Miller', 'Reported blocked: Customer activity preventing completion.', 12),
    ],
  }),

  base({
    title: 'Quarterly fire extinguisher certification log',
    description: 'Confirm all fire extinguishers are within certification date and log tags.',
    department: 'Store Wide',
    priority: 'Normal',
    status: 'Completed',
    dueDate: yesterday,
    dueTime: '15:00',
    estimatedDurationMinutes: 30,
    assignment: assign(['emp_jordan']),
    recurring: true,
    recurrence: { frequency: 'Quarterly', startDate: today, endType: 'never' },
    completedBy: 'Jordan Lee',
    completedAt: new Date(now.getTime() - 60 * 26 * 60000).toISOString(),
    activity: [
      act('created', 'Alex Rivera', 'Quarterly recurring task auto-assigned to Jordan Lee.', 60 * 30),
      act('completed', 'Jordan Lee', 'Completed "Quarterly fire extinguisher certification log".', 60 * 26),
    ],
  }),

  base({
    title: 'Unlock and prep customer service desk',
    description: 'Open the customer service desk, count the till, and boot the register.',
    department: 'Front End',
    priority: 'Normal',
    status: 'Cancelled' as TaskStatus,
    dueDate: yesterday,
    dueTime: '07:00',
    estimatedDurationMinutes: 10,
    assignment: assign(['emp_sarah']),
    cancelled: {
      reason: 'Customer service desk closed for remodel this week.',
      by: 'Alex Rivera',
      at: new Date(now.getTime() - 60 * 30 * 60000).toISOString(),
    },
    activity: [
      act('created', 'Alex Rivera', 'Task created and assigned to Sarah Miller.', 60 * 34),
      act('cancelled', 'Alex Rivera', 'Cancelled: Customer service desk closed for remodel this week.', 60 * 30),
    ],
  }),
]
