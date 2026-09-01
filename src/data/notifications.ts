import { makeId } from '@/lib/id'
import type { AppNotification, Task } from '@/types'

function minsAgo(n: number) {
  return new Date(Date.now() - n * 60000).toISOString()
}

function byTitle(tasks: Task[], title: string): Task | undefined {
  return tasks.find((t) => t.title === title)
}

export function buildSeedNotifications(tasks: Task[]): AppNotification[] {
  const paintTask = byTitle(tasks, 'Check paint tinting supplies')
  const receivingTask = byTitle(tasks, 'Receiving checklist')
  const closingTask = byTitle(tasks, 'Store Closing Checklist')
  const openingTask = byTitle(tasks, 'Store Opening Checklist')
  const safetyTask = byTitle(tasks, 'Weekly Safety Inspection')
  const deliveryTask = byTitle(tasks, 'Unload morning delivery')
  const spillTask = byTitle(tasks, 'Clean up spill in aisle 7')
  const ladderTask = byTitle(tasks, 'Inspect ladder equipment')
  const frontEntranceTask = byTitle(tasks, 'Front entrance cleaning')
  const returnedTask = byTitle(tasks, 'Return misplaced merchandise scan')

  const list: AppNotification[] = [
    {
      id: makeId('notif'),
      timestamp: minsAgo(15),
      title: 'Approval requested',
      message: 'Jordan submitted the "Weekly Safety Inspection" for approval.',
      type: 'approval_request',
      read: false,
      targetRole: 'manager',
      taskId: safetyTask?.id,
    },
    {
      id: makeId('notif'),
      timestamp: minsAgo(18),
      title: 'Task blocked',
      message: 'Sarah reported "Restock endcap during promo event" as blocked — customer activity preventing completion.',
      type: 'blocked',
      read: false,
      targetRole: 'manager',
    },
    {
      id: makeId('notif'),
      timestamp: minsAgo(18),
      title: 'Task blocked',
      message: 'Carlos reported "Inspect ladder equipment" as blocked — safety concern.',
      type: 'blocked',
      read: false,
      targetRole: 'manager',
      taskId: ladderTask?.id,
    },
    {
      id: makeId('notif'),
      timestamp: minsAgo(35),
      title: 'Task blocked',
      message: 'Mike reported "Unload morning delivery" as blocked — equipment unavailable or broken.',
      type: 'blocked',
      read: true,
      targetRole: 'manager',
      taskId: deliveryTask?.id,
    },
    {
      id: makeId('notif'),
      timestamp: minsAgo(45),
      title: 'Due soon',
      message: 'Paint supply check is due in 30 minutes.',
      type: 'reminder',
      read: true,
      targetRole: 'employee',
      employeeId: 'emp_jordan',
      taskId: paintTask?.id,
    },
    {
      id: makeId('notif'),
      timestamp: minsAgo(60 * 2),
      title: 'Escalated',
      message: 'Receiving checklist has been overdue for 2 hours and was escalated to the store manager.',
      type: 'escalation',
      read: true,
      targetRole: 'manager',
      taskId: receivingTask?.id,
    },
    {
      id: makeId('notif'),
      timestamp: minsAgo(60 * 4),
      title: 'Now overdue',
      message: 'Front entrance cleaning is now overdue.',
      type: 'overdue',
      read: true,
      targetRole: 'manager',
      taskId: frontEntranceTask?.id,
    },
    {
      id: makeId('notif'),
      timestamp: minsAgo(60 * 3.3),
      title: 'Approved',
      message: 'Alex approved your "Store Opening Checklist" submission.',
      type: 'approved',
      read: true,
      targetRole: 'employee',
      employeeId: 'emp_sarah',
      taskId: openingTask?.id,
    },
    {
      id: makeId('notif'),
      timestamp: minsAgo(60 * 3.4),
      title: 'Submitted for approval',
      message: 'Sarah submitted the closing checklist for approval.',
      type: 'approval_request',
      read: true,
      targetRole: 'manager',
    },
    {
      id: makeId('notif'),
      timestamp: minsAgo(60 * 20),
      title: 'Returned for correction',
      message: 'Your "Return misplaced merchandise scan" was returned for correction — see manager feedback.',
      type: 'returned',
      read: true,
      targetRole: 'employee',
      employeeId: 'emp_emily',
      taskId: returnedTask?.id,
    },
    {
      id: makeId('notif'),
      timestamp: minsAgo(8),
      title: 'Urgent task assigned',
      message: 'You were assigned an urgent task: "Clean up spill in aisle 7".',
      type: 'info',
      read: false,
      targetRole: 'employee',
      employeeId: 'emp_sarah',
      taskId: spillTask?.id,
    },
    {
      id: makeId('notif'),
      timestamp: minsAgo(30),
      title: 'Reminder',
      message: 'Store Closing Checklist is due at 7:00 PM tonight.',
      type: 'reminder',
      read: false,
      targetRole: 'employee',
      employeeId: 'emp_carlos',
      taskId: closingTask?.id,
    },
  ]

  return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}
