import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import { makeId } from '@/lib/id'
import { effectiveStatus, isOverdue } from '@/lib/task-helpers'
import { findEmployee, MANAGER } from '@/data/employees'
import { SEED_TASKS } from '@/data/tasks'
import { TEMPLATES } from '@/data/templates'
import { buildSeedNotifications } from '@/data/notifications'
import { SEED_ANNOUNCEMENTS } from '@/data/announcements'
import type {
  ActivityType,
  Announcement,
  AppNotification,
  Assignment,
  BlockReasonCategory,
  ChecklistItem,
  Priority,
  ReminderConfig,
  Role,
  Task,
  TaskTemplate,
} from '@/types'

const STORAGE_KEY = 'mah_state_v2'

interface PersistedState {
  tasks: Task[]
  templates: TaskTemplate[]
  notifications: AppNotification[]
  announcements: Announcement[]
  role: Role
  currentEmployeeId: string
}

function loadInitialState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as PersistedState
      if (parsed.tasks?.length) return parsed
    }
  } catch {
    // fall through to seed
  }
  const tasks = SEED_TASKS
  return {
    tasks,
    templates: TEMPLATES,
    notifications: buildSeedNotifications(tasks),
    announcements: SEED_ANNOUNCEMENTS,
    role: 'manager',
    currentEmployeeId: 'emp_sarah',
  }
}

export interface NewTaskInput {
  title: string
  description: string
  department: Task['department']
  priority: Priority
  startDate: string
  dueDate: string
  dueTime: string
  estimatedDurationMinutes: number
  checklist: string[]
  managerNotes?: string
  referenceAttachment?: string
  requirePhoto: boolean
  requireApproval: boolean
  recurring: boolean
  recurrence?: Task['recurrence']
  assignment: Assignment
  reminders: ReminderConfig
  templateId?: string
  templateName?: string
}

interface AppContextValue {
  role: Role
  setRole: (r: Role) => void
  currentEmployeeId: string
  setCurrentEmployeeId: (id: string) => void
  tasks: Task[]
  templates: TaskTemplate[]
  notifications: AppNotification[]
  announcements: Announcement[]
  now: Date

  createTask: (input: NewTaskInput) => Task
  startTask: (taskId: string) => void
  toggleChecklistItem: (taskId: string, itemId: string) => void
  completeTask: (taskId: string, opts: { note?: string; photo?: boolean }) => void
  submitForApproval: (taskId: string, opts: { note?: string; photo?: boolean }) => void
  approveTask: (taskId: string) => void
  returnTask: (taskId: string, reason: string) => void
  reportBlocked: (taskId: string, opts: { reason: BlockReasonCategory; explanation: string; photo: boolean }) => void
  sendMessageToEmployee: (taskId: string, message: string) => void
  reassignTask: (taskId: string, assignment: Assignment) => void
  rescheduleTask: (taskId: string, dueDate: string, dueTime: string) => void
  supplyMissingItem: (taskId: string, note: string) => void
  resolveBlockToProgress: (taskId: string, note?: string) => void
  cancelTask: (taskId: string, reason: string) => void
  addManagerInstructions: (taskId: string, note: string) => void

  markNotificationRead: (id: string) => void
  markAllNotificationsRead: (scope: 'manager' | 'employee') => void
  addAnnouncement: (message: string) => void

  createTemplate: (tpl: Omit<TaskTemplate, 'id' | 'usageHistory'>) => void
  updateTemplate: (id: string, patch: Partial<TaskTemplate>) => void
  duplicateTemplate: (id: string) => void
  assignTemplate: (templateId: string, opts: { assignment: Assignment; dueDate: string; dueTime: string }) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const initial = useRef(loadInitialState()).current
  const [role, setRole] = useState<Role>(initial.role)
  const [currentEmployeeId, setCurrentEmployeeId] = useState(initial.currentEmployeeId)
  const [tasks, setTasks] = useState<Task[]>(initial.tasks)
  const [templates, setTemplates] = useState<TaskTemplate[]>(initial.templates)
  const [notifications, setNotifications] = useState<AppNotification[]>(initial.notifications)
  const [announcements, setAnnouncements] = useState<Announcement[]>(initial.announcements)
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const persisted: PersistedState = { tasks, templates, notifications, announcements, role, currentEmployeeId }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted))
    } catch {
      // storage full or unavailable, ignore for demo purposes
    }
  }, [tasks, templates, notifications, announcements, role, currentEmployeeId])

  // ---- clock tick + simulated reminder/overdue/escalation engine ----
  const remindedRef = useRef<Set<string>>(new Set())
  const overdueNotifiedRef = useRef<Set<string>>(new Set())
  const escalatedRef = useRef<Set<string>>(new Set())
  const lastRepeatRef = useRef<Map<string, number>>(new Map())
  const initializedTimers = useRef(false)

  if (!initializedTimers.current) {
    initializedTimers.current = true
    for (const t of initial.tasks) {
      for (const a of t.activity) {
        if (a.type === 'reminder') remindedRef.current.add(t.id)
        if (a.type === 'overdue') {
          overdueNotifiedRef.current.add(t.id)
          lastRepeatRef.current.set(t.id, Date.now())
        }
        if (a.type === 'escalated') escalatedRef.current.add(t.id)
      }
    }
  }

  const addActivity = useCallback((taskId: string, type: ActivityType, actor: string, message: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, activity: [...t.activity, { id: makeId('act'), timestamp: new Date().toISOString(), type, actor, message }] }
          : t,
      ),
    )
  }, [])

  const pushNotification = useCallback(
    (n: Omit<AppNotification, 'id' | 'timestamp' | 'read'>, opts?: { silent?: boolean }) => {
      const notif: AppNotification = { ...n, id: makeId('notif'), timestamp: new Date().toISOString(), read: false }
      setNotifications((prev) => [notif, ...prev])
      if (!opts?.silent) {
        toast(notif.title, { description: notif.message })
      }
      return notif
    },
    [],
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
      const currentNow = Date.now()
      for (const task of tasks) {
        if (task.status !== 'Not Started' && task.status !== 'In Progress') continue
        const dueMs = new Date(`${task.dueDate}T${task.dueTime}:00`).getTime()
        const minutesUntil = (dueMs - currentNow) / 60000
        const assigneeIds = task.assignment.type === 'employee' || task.assignment.type === 'multiple' ? task.assignment.employeeIds : []

        if (
          task.reminders.remindBeforeDue &&
          !remindedRef.current.has(task.id) &&
          minutesUntil > 0 &&
          minutesUntil <= task.reminders.remindMinutesBefore
        ) {
          remindedRef.current.add(task.id)
          addActivity(task.id, 'reminder', 'System', `Reminder sent: "${task.title}" is due in ${Math.round(minutesUntil)} minutes.`)
          for (const empId of assigneeIds) {
            pushNotification({
              title: 'Due soon',
              message: `${task.title} is due in ${Math.round(minutesUntil)} minutes.`,
              type: 'reminder',
              targetRole: 'employee',
              employeeId: empId,
              taskId: task.id,
            })
          }
        }

        if (minutesUntil < 0) {
          if (!overdueNotifiedRef.current.has(task.id)) {
            overdueNotifiedRef.current.add(task.id)
            lastRepeatRef.current.set(task.id, currentNow)
            addActivity(task.id, 'overdue', 'System', `"${task.title}" is now overdue.`)
            for (const empId of assigneeIds) {
              if (task.reminders.notifyOverdue) {
                pushNotification({
                  title: 'Now overdue',
                  message: `${task.title} is now overdue.`,
                  type: 'overdue',
                  targetRole: 'employee',
                  employeeId: empId,
                  taskId: task.id,
                })
              }
            }
            if (task.reminders.notifyManagerOnOverdue) {
              pushNotification({
                title: 'Task overdue',
                message: `${task.title} is now overdue.`,
                type: 'overdue',
                targetRole: 'manager',
                taskId: task.id,
              })
            }
          } else if (task.reminders.repeatOverdueEvery) {
            const last = lastRepeatRef.current.get(task.id) ?? 0
            const elapsedMin = (currentNow - last) / 60000
            if (elapsedMin >= task.reminders.repeatOverdueEvery) {
              lastRepeatRef.current.set(task.id, currentNow)
              const overdueMin = Math.round(Math.abs(minutesUntil))
              const label = overdueMin >= 60 ? `${Math.floor(overdueMin / 60)}h` : `${overdueMin}m`
              addActivity(task.id, 'reminder', 'System', `Repeat overdue reminder sent — "${task.title}" overdue by ${label}.`)
              pushNotification({
                title: 'Still overdue',
                message: `${task.title} has been overdue for ${label}.`,
                type: 'overdue',
                targetRole: 'manager',
                taskId: task.id,
              })
            }
          }

          if (
            task.reminders.escalateAfterMinutes &&
            !escalatedRef.current.has(task.id) &&
            Math.abs(minutesUntil) >= task.reminders.escalateAfterMinutes
          ) {
            escalatedRef.current.add(task.id)
            const escalateTo = findEmployee(task.reminders.escalateToManagerId)?.name ?? 'the store manager'
            const overdueMin = Math.round(Math.abs(minutesUntil))
            const label = overdueMin >= 60 ? `${Math.floor(overdueMin / 60)} hour${Math.floor(overdueMin / 60) > 1 ? 's' : ''}` : `${overdueMin} minutes`
            addActivity(task.id, 'escalated', 'System', `"${task.title}" has been overdue for ${label} and was escalated to ${escalateTo}.`)
            pushNotification({
              title: 'Escalated',
              message: `${task.title} has been overdue for ${label} and was escalated to ${escalateTo}.`,
              type: 'escalation',
              targetRole: 'manager',
              taskId: task.id,
            })
          }
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, 20000)
    return () => clearInterval(interval)
  }, [tasks, addActivity, pushNotification])

  const actorName = useMemo(() => {
    return role === 'manager' ? MANAGER.name : (findEmployee(currentEmployeeId)?.name ?? 'Employee')
  }, [role, currentEmployeeId])

  const updateTask = useCallback((taskId: string, patch: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, ...patch } : t)))
  }, [])

  const getTask = useCallback((taskId: string) => tasks.find((t) => t.id === taskId), [tasks])

  const createTask = useCallback(
    (input: NewTaskInput): Task => {
      const task: Task = {
        id: makeId('task'),
        title: input.title,
        description: input.description,
        department: input.department,
        priority: input.priority,
        status: 'Not Started',
        startDate: input.startDate,
        dueDate: input.dueDate,
        dueTime: input.dueTime,
        estimatedDurationMinutes: input.estimatedDurationMinutes,
        checklist: input.checklist.map((text) => ({ id: makeId('chk'), text, done: false })),
        managerNotes: input.managerNotes,
        referenceAttachment: input.referenceAttachment,
        requirePhoto: input.requirePhoto,
        requireApproval: input.requireApproval,
        recurring: input.recurring,
        recurrence: input.recurrence,
        assignment: input.assignment,
        reminders: input.reminders,
        createdBy: MANAGER.name,
        createdAt: new Date().toISOString(),
        templateId: input.templateId,
        templateName: input.templateName,
        activity: [],
      }
      const assignMsg =
        task.assignment.type === 'unassigned'
          ? 'Task created, left unassigned.'
          : task.assignment.type === 'department'
            ? `Task created and assigned to the ${task.assignment.department} team.`
            : `Task created and assigned to ${task.assignment.employeeIds.map((id) => findEmployee(id)?.name).join(', ')}.`
      task.activity.push({ id: makeId('act'), timestamp: task.createdAt, type: 'created', actor: MANAGER.name, message: assignMsg })

      setTasks((prev) => [task, ...prev])

      if (task.assignment.type === 'employee' || task.assignment.type === 'multiple') {
        for (const empId of task.assignment.employeeIds) {
          pushNotification(
            {
              title: 'New task assigned',
              message: `You were assigned "${task.title}", due ${task.dueTime} on ${task.dueDate}.`,
              type: 'info',
              targetRole: 'employee',
              employeeId: empId,
              taskId: task.id,
            },
            { silent: true },
          )
        }
      }
      toast.success('Task created', { description: `"${task.title}" added to the schedule.` })
      return task
    },
    [pushNotification],
  )

  const startTask = useCallback(
    (taskId: string) => {
      updateTask(taskId, { status: 'In Progress' })
      addActivity(taskId, 'status', actorName, `Marked "${getTask(taskId)?.title}" as In Progress.`)
    },
    [updateTask, addActivity, actorName, getTask],
  )

  const toggleChecklistItem = useCallback(
    (taskId: string, itemId: string) => {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id !== taskId) return t
          const checklist: ChecklistItem[] = t.checklist.map((c) =>
            c.id === itemId
              ? {
                  ...c,
                  done: !c.done,
                  doneBy: !c.done ? actorName : undefined,
                  doneAt: !c.done ? new Date().toISOString() : undefined,
                }
              : c,
          )
          return { ...t, checklist, status: t.status === 'Not Started' ? 'In Progress' : t.status }
        }),
      )
    },
    [actorName],
  )

  const completeTask = useCallback(
    (taskId: string, opts: { note?: string; photo?: boolean }) => {
      const task = getTask(taskId)
      updateTask(taskId, {
        status: 'Completed',
        completedBy: actorName,
        completedAt: new Date().toISOString(),
        completionNote: opts.note,
        completionPhoto: opts.photo,
      })
      addActivity(taskId, 'completed', actorName, `Completed "${task?.title}"${opts.note ? ` — ${opts.note}` : '.'}`)
      pushNotification(
        { title: 'Task completed', message: `${actorName} completed "${task?.title}".`, type: 'info', targetRole: 'manager', taskId },
        { silent: true },
      )
      toast.success('Task completed', { description: task?.title })
    },
    [updateTask, addActivity, getTask, actorName, pushNotification],
  )

  const submitForApproval = useCallback(
    (taskId: string, opts: { note?: string; photo?: boolean }) => {
      const task = getTask(taskId)
      updateTask(taskId, {
        status: 'Awaiting Approval',
        completedBy: actorName,
        completedAt: new Date().toISOString(),
        completionNote: opts.note,
        completionPhoto: opts.photo,
      })
      addActivity(taskId, 'submitted', actorName, `Submitted "${task?.title}" for manager approval.`)
      pushNotification({
        title: 'Approval requested',
        message: `${actorName} submitted "${task?.title}" for approval.`,
        type: 'approval_request',
        targetRole: 'manager',
        taskId,
      })
      toast.success('Submitted for approval', { description: task?.title })
    },
    [updateTask, addActivity, getTask, actorName, pushNotification],
  )

  const approveTask = useCallback(
    (taskId: string) => {
      const task = getTask(taskId)
      updateTask(taskId, { status: 'Completed', approvedBy: MANAGER.name, approvedAt: new Date().toISOString() })
      addActivity(taskId, 'approved', MANAGER.name, `Approved "${task?.title}".`)
      const assigneeIds = task?.assignment.type === 'employee' || task?.assignment.type === 'multiple' ? task.assignment.employeeIds : []
      for (const empId of assigneeIds) {
        pushNotification({
          title: 'Approved',
          message: `${MANAGER.name} approved your "${task?.title}" submission.`,
          type: 'approved',
          targetRole: 'employee',
          employeeId: empId,
          taskId,
        })
      }
      toast.success('Task approved', { description: task?.title })
    },
    [updateTask, addActivity, getTask, pushNotification],
  )

  const returnTask = useCallback(
    (taskId: string, reason: string) => {
      const task = getTask(taskId)
      updateTask(taskId, { status: 'Returned for Correction', returnedReason: reason, returnedBy: MANAGER.name, returnedAt: new Date().toISOString() })
      addActivity(taskId, 'returned', MANAGER.name, `Returned "${task?.title}" for correction: ${reason}`)
      const assigneeIds = task?.assignment.type === 'employee' || task?.assignment.type === 'multiple' ? task.assignment.employeeIds : []
      for (const empId of assigneeIds) {
        pushNotification({
          title: 'Returned for correction',
          message: `"${task?.title}" was returned for correction: ${reason}`,
          type: 'returned',
          targetRole: 'employee',
          employeeId: empId,
          taskId,
        })
      }
      toast('Task returned to employee', { description: task?.title })
    },
    [updateTask, addActivity, getTask, pushNotification],
  )

  const reportBlocked = useCallback(
    (taskId: string, opts: { reason: BlockReasonCategory; explanation: string; photo: boolean }) => {
      const task = getTask(taskId)
      updateTask(taskId, {
        status: 'Blocked',
        blocked: {
          reason: opts.reason,
          explanation: opts.explanation,
          photo: opts.photo,
          reportedBy: actorName,
          reportedAt: new Date().toISOString(),
          resolved: false,
        },
      })
      addActivity(taskId, 'blocked', actorName, `Reported blocked: ${opts.reason} — ${opts.explanation}`)
      pushNotification({
        title: 'Task blocked',
        message: `${actorName} reported "${task?.title}" as blocked — ${opts.reason}.`,
        type: 'blocked',
        targetRole: 'manager',
        taskId,
      })
      toast('Reported as blocked', { description: task?.title })
    },
    [updateTask, addActivity, getTask, actorName, pushNotification],
  )

  const sendMessageToEmployee = useCallback(
    (taskId: string, message: string) => {
      const task = getTask(taskId)
      addActivity(taskId, 'message', MANAGER.name, `Message to employee: ${message}`)
      const assigneeIds = task?.assignment.type === 'employee' || task?.assignment.type === 'multiple' ? task.assignment.employeeIds : []
      for (const empId of assigneeIds) {
        pushNotification({
          title: 'Message from manager',
          message: `${MANAGER.name}: ${message}`,
          type: 'info',
          targetRole: 'employee',
          employeeId: empId,
          taskId,
        })
      }
      toast.success('Message sent')
    },
    [addActivity, getTask, pushNotification],
  )

  const reassignTask = useCallback(
    (taskId: string, assignment: Assignment) => {
      const task = getTask(taskId)
      updateTask(taskId, { assignment })
      const label =
        assignment.type === 'unassigned'
          ? 'left unassigned'
          : assignment.type === 'department'
            ? `assigned to the ${assignment.department} team`
            : `reassigned to ${assignment.employeeIds.map((id) => findEmployee(id)?.name).join(', ')}`
      addActivity(taskId, 'reassigned', MANAGER.name, `"${task?.title}" ${label}.`)
      if (assignment.type === 'employee' || assignment.type === 'multiple') {
        for (const empId of assignment.employeeIds) {
          pushNotification({
            title: 'Task assigned to you',
            message: `${MANAGER.name} assigned "${task?.title}" to you.`,
            type: 'info',
            targetRole: 'employee',
            employeeId: empId,
            taskId,
          })
        }
      }
      toast.success('Task reassigned')
    },
    [updateTask, addActivity, getTask, pushNotification],
  )

  const rescheduleTask = useCallback(
    (taskId: string, dueDate: string, dueTime: string) => {
      const task = getTask(taskId)
      updateTask(taskId, { dueDate, dueTime })
      addActivity(taskId, 'rescheduled', MANAGER.name, `Rescheduled "${task?.title}" to ${dueDate} at ${dueTime}.`)
      toast.success('Task rescheduled')
    },
    [updateTask, addActivity, getTask],
  )

  const supplyMissingItem = useCallback(
    (taskId: string, note: string) => {
      const task = getTask(taskId)
      addActivity(taskId, 'note', MANAGER.name, `Supplied missing item: ${note}`)
      toast.success('Marked item as supplied', { description: task?.title })
    },
    [addActivity, getTask],
  )

  const resolveBlockToProgress = useCallback(
    (taskId: string, note?: string) => {
      const task = getTask(taskId)
      updateTask(taskId, {
        status: 'In Progress',
        blocked: task?.blocked ? { ...task.blocked, resolved: true, resolvedAt: new Date().toISOString(), resolvedBy: MANAGER.name, resolutionNote: note } : undefined,
      })
      addActivity(taskId, 'unblocked', MANAGER.name, `Marked issue resolved${note ? `: ${note}` : ''}. Returned "${task?.title}" to In Progress.`)
      const assigneeIds = task?.assignment.type === 'employee' || task?.assignment.type === 'multiple' ? task.assignment.employeeIds : []
      for (const empId of assigneeIds) {
        pushNotification({
          title: 'Task unblocked',
          message: `${MANAGER.name} resolved the issue on "${task?.title}" — back to In Progress.`,
          type: 'info',
          targetRole: 'employee',
          employeeId: empId,
          taskId,
        })
      }
      toast.success('Task returned to In Progress')
    },
    [updateTask, addActivity, getTask, pushNotification],
  )

  const cancelTask = useCallback(
    (taskId: string, reason: string) => {
      const task = getTask(taskId)
      updateTask(taskId, { status: 'Cancelled', cancelled: { reason, by: MANAGER.name, at: new Date().toISOString() } })
      addActivity(taskId, 'cancelled', MANAGER.name, `Cancelled: ${reason}`)
      toast('Task cancelled', { description: task?.title })
    },
    [updateTask, addActivity, getTask],
  )

  const addManagerInstructions = useCallback(
    (taskId: string, note: string) => {
      const task = getTask(taskId)
      updateTask(taskId, { managerNotes: task?.managerNotes ? `${task.managerNotes}\n${note}` : note })
      addActivity(taskId, 'note', MANAGER.name, `Added instructions: ${note}`)
      toast.success('Instructions added')
    },
    [updateTask, addActivity, getTask],
  )

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }, [])

  const markAllNotificationsRead = useCallback((scope: 'manager' | 'employee') => {
    setNotifications((prev) =>
      prev.map((n) => (n.targetRole === scope && (scope === 'manager' || n.employeeId === currentEmployeeId) ? { ...n, read: true } : n)),
    )
  }, [currentEmployeeId])

  const addAnnouncement = useCallback((message: string) => {
    setAnnouncements((prev) => [{ id: makeId('ann'), timestamp: new Date().toISOString(), author: MANAGER.name, message }, ...prev])
    toast.success('Announcement posted')
  }, [])

  const createTemplate = useCallback((tpl: Omit<TaskTemplate, 'id' | 'usageHistory'>) => {
    setTemplates((prev) => [{ ...tpl, id: makeId('tpl'), usageHistory: [] }, ...prev])
    toast.success('Template created', { description: tpl.name })
  }, [])

  const updateTemplate = useCallback((id: string, patch: Partial<TaskTemplate>) => {
    setTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)))
    toast.success('Template updated')
  }, [])

  const duplicateTemplate = useCallback((id: string) => {
    setTemplates((prev) => {
      const src = prev.find((t) => t.id === id)
      if (!src) return prev
      const copy: TaskTemplate = { ...src, id: makeId('tpl'), name: `${src.name} (Copy)`, usageHistory: [] }
      return [copy, ...prev]
    })
    toast.success('Template duplicated')
  }, [])

  const assignTemplate = useCallback(
    (templateId: string, opts: { assignment: Assignment; dueDate: string; dueTime: string }) => {
      const tpl = templates.find((t) => t.id === templateId)
      if (!tpl) return
      const task: Task = {
        id: makeId('task'),
        title: tpl.name,
        description: tpl.description,
        department: tpl.department,
        priority: tpl.defaultPriority,
        status: 'Not Started',
        startDate: opts.dueDate,
        dueDate: opts.dueDate,
        dueTime: opts.dueTime,
        estimatedDurationMinutes: tpl.estimatedDurationMinutes,
        checklist: tpl.checklist.map((s) => ({ id: makeId('chk'), text: s.text, done: false })),
        requirePhoto: tpl.requirePhoto,
        requireApproval: tpl.requireApproval,
        recurring: tpl.recurring,
        recurrence: tpl.recurrence,
        assignment: opts.assignment,
        reminders: tpl.reminders,
        createdBy: MANAGER.name,
        createdAt: new Date().toISOString(),
        templateId: tpl.id,
        templateName: tpl.name,
        activity: [],
      }
      const assignLabel =
        opts.assignment.type === 'unassigned'
          ? 'left unassigned'
          : opts.assignment.type === 'department'
            ? `assigned to the ${opts.assignment.department} team`
            : `assigned to ${opts.assignment.employeeIds.map((id) => findEmployee(id)?.name).join(', ')}`
      task.activity.push({
        id: makeId('act'),
        timestamp: task.createdAt,
        type: 'created',
        actor: MANAGER.name,
        message: `"${tpl.name}" template ${assignLabel}.`,
      })
      setTasks((prev) => [task, ...prev])
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === templateId
            ? {
                ...t,
                usageHistory: [
                  {
                    id: makeId('use'),
                    date: opts.dueDate,
                    assignedTo:
                      opts.assignment.type === 'unassigned'
                        ? 'Unassigned'
                        : opts.assignment.type === 'department'
                          ? `${opts.assignment.department} team`
                          : opts.assignment.employeeIds.map((id) => findEmployee(id)?.name).join(', '),
                    status: 'Not Started',
                  },
                  ...t.usageHistory,
                ],
              }
            : t,
        ),
      )
      if (opts.assignment.type === 'employee' || opts.assignment.type === 'multiple') {
        for (const empId of opts.assignment.employeeIds) {
          pushNotification(
            {
              title: 'New task assigned',
              message: `You were assigned "${tpl.name}", due ${opts.dueTime} on ${opts.dueDate}.`,
              type: 'info',
              targetRole: 'employee',
              employeeId: empId,
              taskId: task.id,
            },
            { silent: true },
          )
        }
      }
      toast.success('Template assigned', { description: `${tpl.name} added to the schedule.` })
    },
    [templates, pushNotification],
  )

  const value: AppContextValue = {
    role,
    setRole,
    currentEmployeeId,
    setCurrentEmployeeId,
    tasks,
    templates,
    notifications,
    announcements,
    now,
    createTask,
    startTask,
    toggleChecklistItem,
    completeTask,
    submitForApproval,
    approveTask,
    returnTask,
    reportBlocked,
    sendMessageToEmployee,
    reassignTask,
    rescheduleTask,
    supplyMissingItem,
    resolveBlockToProgress,
    cancelTask,
    addManagerInstructions,
    markNotificationRead,
    markAllNotificationsRead,
    addAnnouncement,
    createTemplate,
    updateTemplate,
    duplicateTemplate,
    assignTemplate,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

export { effectiveStatus, isOverdue }
