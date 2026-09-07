import {
  AlertTriangle,
  Bell,
  Building2,
  Camera,
  Check,
  CheckCircle2,
  Clock,
  Layers,
  MessageSquare,
  Paperclip,
  Repeat,
  ShieldAlert,
  Timer,
  Users as UsersIcon,
  XCircle,
} from 'lucide-react'
import type { ComponentType } from 'react'
import { useState } from 'react'
import { ActivityTimeline } from '@/components/tasks/ActivityTimeline'
import { ApprovalTag, PriorityBadge, RecurringTag, ReminderTag, StatusBadge } from '@/components/tasks/badges'
import { BlockTaskDialog } from '@/components/tasks/BlockTaskDialog'
import { CompleteTaskDialog } from '@/components/tasks/CompleteTaskDialog'
import { PromptDialog } from '@/components/tasks/PromptDialog'
import { ReassignDialog } from '@/components/tasks/ReassignDialog'
import { RescheduleDialog } from '@/components/tasks/RescheduleDialog'
import { TranslationNotice } from '@/components/content/TranslationNotice'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, SidePanel } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { findEmployee } from '@/data/employees'
import { formatDateMedium, formatDuration, formatTime12, formatTimestamp } from '@/lib/date'
import { assignmentLabel, checklistProgress, effectiveStatus, isAssignedTo, recurrenceSummary } from '@/lib/task-helpers'
import { resolveTranslation } from '@/lib/translate'
import { cn } from '@/lib/utils'
import { useApp } from '@/store/AppContext'
import type { Assignment } from '@/types'

export function TaskDetailPanel({ taskId, onClose }: { taskId: string | null; onClose: () => void }) {
  const app = useApp()
  const { role, currentEmployeeId, tasks, now, translations, getEmployeeLanguage } = app
  const task = tasks.find((t) => t.id === taskId) ?? null

  const [blockOpen, setBlockOpen] = useState(false)
  const [showOriginalTask, setShowOriginalTask] = useState(false)
  const [reassignOpen, setReassignOpen] = useState(false)
  const [rescheduleOpen, setRescheduleOpen] = useState(false)
  const [returnOpen, setReturnOpen] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [messageOpen, setMessageOpen] = useState(false)
  const [instructionsOpen, setInstructionsOpen] = useState(false)
  const [supplyOpen, setSupplyOpen] = useState(false)
  const [resolveOpen, setResolveOpen] = useState(false)
  const [completeOpen, setCompleteOpen] = useState(false)

  if (!task) return null

  const status = effectiveStatus(task, now)
  const progress = checklistProgress(task)
  const isEmployeeView = role === 'employee'
  const employeeLang = isEmployeeView ? getEmployeeLanguage(currentEmployeeId) : 'en'
  const taskTranslation = resolveTranslation({
    cache: translations,
    type: 'task',
    id: task.id,
    version: 1,
    sourceLanguage: 'en',
    sourceTitle: task.title,
    sourceContent: task.description,
    targetLanguage: employeeLang,
  })
  const displayTitle = isEmployeeView && !showOriginalTask ? (taskTranslation.title ?? task.title) : task.title
  const displayDescription = isEmployeeView && !showOriginalTask ? taskTranslation.content : task.description
  const assignedToMe = isEmployeeView && isAssignedTo(task, currentEmployeeId)
  const canAct = assignedToMe && ['Not Started', 'In Progress', 'Returned for Correction'].includes(task.status)
  const canSubmitFinish = canAct && task.status !== 'Not Started' && (progress.total === 0 || progress.done === progress.total)
  const assigneeIds = task.assignment.type === 'employee' || task.assignment.type === 'multiple' ? task.assignment.employeeIds : []
  const canMessageEmployee = assigneeIds.length > 0

  return (
    <>
      <Dialog open={!!taskId} onOpenChange={(v) => !v && onClose()}>
        {!!taskId && (
          <SidePanel title={displayTitle} description={`${task.department} · ${formatDateMedium(task.dueDate)} at ${formatTime12(task.dueTime)}`} width="xl">
            <div className="space-y-6 pb-24">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={status} />
                <PriorityBadge priority={task.priority} />
                {task.recurring && <RecurringTag />}
                {task.reminders.remindBeforeDue && <ReminderTag />}
                {task.requireApproval && <ApprovalTag />}
                {task.templateName && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-ink-100 px-2.5 py-0.5 text-xs font-medium text-ink-600">
                    <Layers className="size-3" />
                    From template: {task.templateName}
                  </span>
                )}
              </div>

              {isEmployeeView && taskTranslation.isTranslated && (
                <TranslationNotice
                  sourceLanguage="en"
                  targetLanguage={employeeLang}
                  isTranslated={taskTranslation.isTranslated}
                  isAvailable={taskTranslation.isAvailable}
                  showingOriginal={showOriginalTask}
                  onToggle={() => setShowOriginalTask((v) => !v)}
                />
              )}

              {displayDescription && <p className="text-sm leading-relaxed text-ink-700">{displayDescription}</p>}

              <dl className="grid grid-cols-2 gap-4 rounded-xl border border-ink-200 bg-ink-50 p-4 text-sm sm:grid-cols-3">
                <InfoItem icon={Building2} label="Department" value={task.department} />
                <InfoItem icon={UsersIcon} label="Assigned to" value={assignmentLabel(task, (id) => findEmployee(id)?.name ?? 'Unknown')} />
                <InfoItem icon={Timer} label="Est. duration" value={formatDuration(task.estimatedDurationMinutes)} />
                <InfoItem icon={Clock} label="Due" value={`${formatDateMedium(task.dueDate)}, ${formatTime12(task.dueTime)}`} />
                <InfoItem icon={CheckCircle2} label="Created by" value={task.createdBy} />
                {task.completedBy && <InfoItem icon={CheckCircle2} label="Completed by" value={`${task.completedBy}, ${formatTimestamp(task.completedAt!)}`} />}
              </dl>

              {task.recurring && task.recurrence && (
                <p className="flex items-start gap-2 rounded-lg bg-sky-50 px-3 py-2.5 text-sm text-sky-800">
                  <Repeat className="mt-0.5 size-4 shrink-0" />
                  {recurrenceSummary(task)}
                </p>
              )}

              {task.managerNotes && (
                <div className="rounded-lg border border-ink-200 bg-card p-4">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-400">Manager notes</p>
                  <p className="whitespace-pre-line text-sm text-ink-700">{task.managerNotes}</p>
                </div>
              )}

              {task.referenceAttachment && (
                <p className="flex items-center gap-2 text-sm text-ink-600">
                  <Paperclip className="size-4 text-ink-400" />
                  {task.referenceAttachment}
                </p>
              )}

              {task.checklist.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-ink-900">Checklist</p>
                    <p className="text-xs text-ink-500">
                      {progress.done} of {progress.total} complete
                    </p>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${progress.total ? (progress.done / progress.total) * 100 : 0}%` }}
                    />
                  </div>
                  <ul className="space-y-2">
                    {task.checklist.map((item) => (
                      <li key={item.id} className="flex items-start gap-3 rounded-lg border border-ink-100 px-3 py-2.5">
                        <Checkbox
                          checked={item.done}
                          disabled={!canAct}
                          onCheckedChange={() => app.toggleChecklistItem(task.id, item.id)}
                          id={`chk-${item.id}`}
                          className={item.done ? 'animate-check-pop' : ''}
                        />
                        <label htmlFor={`chk-${item.id}`} className={cn('flex-1 text-sm', item.done ? 'text-ink-400 line-through' : 'text-ink-800', canAct && 'cursor-pointer')}>
                          {item.text}
                          {item.done && item.doneBy && <span className="ml-2 text-xs text-ink-400 no-underline">· {item.doneBy}</span>}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {task.completionNote && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">Completion note</p>
                  <p className="text-sm text-emerald-900">{task.completionNote}</p>
                  {task.completionPhoto && (
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-emerald-700">
                      <Camera className="size-3.5" /> Completion photo attached
                    </p>
                  )}
                </div>
              )}

              {task.status === 'Awaiting Approval' && role === 'manager' && (
                <div className="space-y-3 rounded-xl border border-violet-200 bg-violet-50 p-4">
                  <p className="text-sm font-semibold text-violet-900">Awaiting your approval</p>
                  <p className="text-sm text-violet-800">
                    Submitted by <span className="font-semibold">{task.completedBy}</span> on {formatTimestamp(task.completedAt!)}.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Button onClick={() => app.approveTask(task.id)}>
                      <Check className="size-4" />
                      Approve
                    </Button>
                    <Button variant="secondary" onClick={() => setReturnOpen(true)}>
                      Return for Correction
                    </Button>
                    <Button variant="secondary" onClick={() => setReassignOpen(true)}>
                      Reassign
                    </Button>
                  </div>
                </div>
              )}

              {task.status === 'Blocked' && task.blocked && (
                <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <p className="flex items-center gap-2 text-sm font-semibold text-amber-900">
                    <ShieldAlert className="size-4" />
                    Blocked — {task.blocked.reason}
                  </p>
                  <p className="text-sm text-amber-900">{task.blocked.explanation}</p>
                  {task.blocked.photo && (
                    <p className="flex items-center gap-1.5 text-xs text-amber-700">
                      <Camera className="size-3.5" /> Photo attached
                    </p>
                  )}
                  <p className="text-xs text-amber-700">
                    Reported by {task.blocked.reportedBy}, {formatTimestamp(task.blocked.reportedAt)}
                  </p>
                  {role === 'manager' && !task.blocked.resolved && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Button variant="secondary" size="sm" onClick={() => setInstructionsOpen(true)}>
                        Add Instructions
                      </Button>
                      {canMessageEmployee && (
                        <Button variant="secondary" size="sm" onClick={() => setMessageOpen(true)}>
                          <MessageSquare className="size-3.5" />
                          Message Employee
                        </Button>
                      )}
                      <Button variant="secondary" size="sm" onClick={() => setReassignOpen(true)}>
                        Reassign
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => setRescheduleOpen(true)}>
                        Reschedule
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => setSupplyOpen(true)}>
                        Supply Missing Item
                      </Button>
                      <Button size="sm" onClick={() => setResolveOpen(true)}>
                        Mark Resolved → In Progress
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => setCancelOpen(true)}>
                        <XCircle className="size-3.5" />
                        Cancel Task
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {task.status === 'Returned for Correction' && (
                <div className="space-y-2 rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm font-semibold text-amber-900">Returned for correction</p>
                  <p className="text-sm text-amber-900">{task.returnedReason}</p>
                  <p className="text-xs text-amber-700">
                    By {task.returnedBy}, {formatTimestamp(task.returnedAt!)}
                  </p>
                </div>
              )}

              {task.cancelled && (
                <div className="space-y-2 rounded-xl border border-ink-200 bg-ink-50 p-4">
                  <p className="text-sm font-semibold text-ink-700">Task cancelled</p>
                  <p className="text-sm text-ink-600">{task.cancelled.reason}</p>
                  <p className="text-xs text-ink-400">
                    By {task.cancelled.by}, {formatTimestamp(task.cancelled.at)}
                  </p>
                </div>
              )}

              {status === 'Overdue' && (
                <p className="flex items-center gap-2 rounded-lg bg-rose-50 px-3 py-2.5 text-sm font-medium text-rose-700">
                  <AlertTriangle className="size-4" />
                  This task is overdue.
                </p>
              )}

              <div className="space-y-2 rounded-lg border border-ink-200 p-4">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-400">
                  <Bell className="size-3.5" /> Reminders
                </p>
                <ul className="space-y-1 text-sm text-ink-600">
                  {task.reminders.remindBeforeDue && <li>Reminds assignee {task.reminders.remindMinutesBefore} min before due.</li>}
                  {task.reminders.notifyOverdue && <li>Notifies assignee when overdue.</li>}
                  {task.reminders.notifyManagerOnOverdue && <li>Notifies manager when overdue{task.reminders.repeatOverdueEvery ? `, repeating every ${task.reminders.repeatOverdueEvery} min` : ''}.</li>}
                  {task.reminders.escalateAfterMinutes && (
                    <li>
                      Escalates to {findEmployee(task.reminders.escalateToManagerId)?.name ?? 'a manager'} after {task.reminders.escalateAfterMinutes} min overdue.
                    </li>
                  )}
                </ul>
              </div>

              <Separator />

              <div>
                <p className="mb-3 text-sm font-semibold text-ink-900">Activity history</p>
                <ActivityTimeline entries={task.activity} />
              </div>
            </div>

            <div className="sticky bottom-0 left-0 right-0 -mx-6 -mb-5 mt-6 border-t border-ink-200 bg-card px-6 py-4">
              {isEmployeeView && assignedToMe && task.status === 'Not Started' && (
                <Button className="w-full" onClick={() => app.startTask(task.id)}>
                  Start Task
                </Button>
              )}
              {isEmployeeView && canAct && task.status !== 'Not Started' && (
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button variant="secondary" className="flex-1" onClick={() => setBlockOpen(true)}>
                    <ShieldAlert className="size-4" />
                    Report a Problem
                  </Button>
                  <Button className="flex-1" disabled={!canSubmitFinish} onClick={() => setCompleteOpen(true)}>
                    {task.requireApproval ? 'Submit for Approval' : 'Mark Complete'}
                  </Button>
                </div>
              )}
              {isEmployeeView && canAct && !canSubmitFinish && task.status !== 'Not Started' && (
                <p className="mt-2 text-center text-xs text-ink-400">Check off all checklist steps to finish this task.</p>
              )}
              {role === 'manager' && task.status !== 'Blocked' && task.status !== 'Awaiting Approval' && !task.cancelled && task.status !== 'Completed' && (
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" size="sm" onClick={() => setInstructionsOpen(true)}>
                    Add Instructions
                  </Button>
                  {canMessageEmployee && (
                    <Button variant="secondary" size="sm" onClick={() => setMessageOpen(true)}>
                      <MessageSquare className="size-3.5" />
                      Message
                    </Button>
                  )}
                  <Button variant="secondary" size="sm" onClick={() => setReassignOpen(true)}>
                    Reassign
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => setRescheduleOpen(true)}>
                    Reschedule
                  </Button>
                  <Button variant="danger" size="sm" className="ml-auto" onClick={() => setCancelOpen(true)}>
                    Cancel Task
                  </Button>
                </div>
              )}
            </div>
          </SidePanel>
        )}
      </Dialog>

      <BlockTaskDialog open={blockOpen} onOpenChange={setBlockOpen} taskTitle={task.title} onSubmit={(opts) => app.reportBlocked(task.id, opts)} />
      <CompleteTaskDialog
        open={completeOpen}
        onOpenChange={setCompleteOpen}
        taskTitle={task.title}
        requirePhoto={task.requirePhoto}
        requireApproval={task.requireApproval}
        onConfirm={(opts) => (task.requireApproval ? app.submitForApproval(task.id, opts) : app.completeTask(task.id, opts))}
      />
      <ReassignDialog open={reassignOpen} onOpenChange={setReassignOpen} initial={task.assignment} onSubmit={(a: Assignment) => app.reassignTask(task.id, a)} />
      <RescheduleDialog
        open={rescheduleOpen}
        onOpenChange={setRescheduleOpen}
        initialDate={task.dueDate}
        initialTime={task.dueTime}
        onSubmit={(d, t) => app.rescheduleTask(task.id, d, t)}
      />
      <PromptDialog
        open={returnOpen}
        onOpenChange={setReturnOpen}
        title="Return for Correction"
        description={task.title}
        label="What needs to be fixed?"
        placeholder="Be specific so it's easy to correct…"
        confirmLabel="Return to Employee"
        onSubmit={(reason) => app.returnTask(task.id, reason)}
      />
      <PromptDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title="Cancel Task"
        description={task.title}
        label="Reason for cancelling"
        confirmLabel="Cancel Task"
        danger
        onSubmit={(reason) => app.cancelTask(task.id, reason)}
      />
      <PromptDialog
        open={messageOpen}
        onOpenChange={setMessageOpen}
        title="Message Employee"
        description={task.title}
        label="Message"
        placeholder="Let them know what to do next…"
        confirmLabel="Send Message"
        onSubmit={(msg) => app.sendMessageToEmployee(task.id, msg)}
      />
      <PromptDialog
        open={instructionsOpen}
        onOpenChange={setInstructionsOpen}
        title="Add Instructions"
        description={task.title}
        label="Instructions"
        confirmLabel="Add Instructions"
        onSubmit={(note) => app.addManagerInstructions(task.id, note)}
      />
      <PromptDialog
        open={supplyOpen}
        onOpenChange={setSupplyOpen}
        title="Supply Missing Item"
        description={task.title}
        label="What was supplied?"
        confirmLabel="Mark Supplied"
        onSubmit={(note) => app.supplyMissingItem(task.id, note)}
      />
      <PromptDialog
        open={resolveOpen}
        onOpenChange={setResolveOpen}
        title="Mark Issue Resolved"
        description={task.title}
        label="Resolution note (optional)"
        confirmLabel="Return to In Progress"
        required={false}
        onSubmit={(note) => app.resolveBlockToProgress(task.id, note || undefined)}
      />
    </>
  )
}

function InfoItem({ icon: Icon, label, value }: { icon: ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 size-4 shrink-0 text-ink-400" />
      <div className="min-w-0">
        <dt className="text-xs text-ink-400">{label}</dt>
        <dd className="truncate font-medium text-ink-800">{value}</dd>
      </div>
    </div>
  )
}
