import { Paperclip } from 'lucide-react'
import { useState } from 'react'
import { AssignmentPicker } from '@/components/tasks/AssignmentPicker'
import { ChecklistBuilder } from '@/components/tasks/ChecklistBuilder'
import { RecurrenceEditor } from '@/components/tasks/RecurrenceEditor'
import { ReminderSettingsForm } from '@/components/tasks/ReminderSettingsForm'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/checkbox'
import { Dialog, Modal } from '@/components/ui/dialog'
import { FieldGroup, Input, Textarea } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { defaultReminders } from '@/data/templates'
import { todayISO } from '@/lib/date'
import { useApp, type NewTaskInput } from '@/store/AppContext'
import { DEPARTMENTS, PRIORITIES, type Assignment, type Department, type Priority, type RecurrenceConfig } from '@/types'

const DURATIONS = [10, 15, 20, 30, 45, 60, 90, 120]

function emptyForm(): NewTaskInput {
  const today = todayISO()
  return {
    title: '',
    description: '',
    department: 'Store Wide',
    priority: 'Normal',
    startDate: today,
    dueDate: today,
    dueTime: '17:00',
    estimatedDurationMinutes: 30,
    checklist: [],
    managerNotes: '',
    referenceAttachment: undefined,
    requirePhoto: false,
    requireApproval: false,
    recurring: false,
    recurrence: undefined,
    assignment: { type: 'employee', employeeIds: [] },
    reminders: defaultReminders(),
  }
}

export function CreateTaskModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { createTask } = useApp()
  const [form, setForm] = useState<NewTaskInput>(emptyForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [fileName, setFileName] = useState<string | null>(null)

  function reset() {
    setForm(emptyForm())
    setErrors({})
    setFileName(null)
  }

  function validAssignment(a: Assignment) {
    if (a.type === 'employee') return a.employeeIds.length === 1
    if (a.type === 'multiple') return a.employeeIds.length >= 2
    if (a.type === 'department') return !!a.department
    return true
  }

  function handleSubmit() {
    const nextErrors: Record<string, string> = {}
    if (!form.title.trim()) nextErrors.title = 'Title is required.'
    if (!form.dueDate) nextErrors.dueDate = 'Due date is required.'
    if (!form.dueTime) nextErrors.dueTime = 'Due time is required.'
    if (form.dueDate < form.startDate) nextErrors.dueDate = 'Due date cannot be before the start date.'
    if (!validAssignment(form.assignment)) nextErrors.assignment = 'Choose who this task is assigned to.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    createTask(form)
    onOpenChange(false)
    reset()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        if (!v) reset()
      }}
    >
      {open && (
        <Modal title="Create Task" description="Set up a task and assign it to the right person, team, or leave it open." size="xl">
          <div className="space-y-6">
            <FieldGroup label="Task title" required htmlFor="task-title">
              <Input id="task-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Restock paint aisle endcap" />
              {errors.title && <p className="text-xs text-brand-600">{errors.title}</p>}
            </FieldGroup>

            <FieldGroup label="Description and instructions" htmlFor="task-desc">
              <Textarea
                id="task-desc"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="What needs to happen, and any details the employee needs to know…"
                rows={3}
              />
            </FieldGroup>

            <div className="grid gap-4 sm:grid-cols-2">
              <FieldGroup label="Department / store area" required>
                <Select value={form.department} onValueChange={(d: Department) => setForm({ ...form, department: d })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldGroup>
              <FieldGroup label="Priority" required>
                <Select value={form.priority} onValueChange={(p: Priority) => setForm({ ...form, priority: p })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldGroup>
            </div>

            <div className="grid gap-4 sm:grid-cols-4">
              <FieldGroup label="Start date">
                <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
              </FieldGroup>
              <FieldGroup label="Due date" required>
                <Input type="date" value={form.dueDate} min={form.startDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
                {errors.dueDate && <p className="text-xs text-brand-600">{errors.dueDate}</p>}
              </FieldGroup>
              <FieldGroup label="Due time" required>
                <Input type="time" value={form.dueTime} onChange={(e) => setForm({ ...form, dueTime: e.target.value })} />
              </FieldGroup>
              <FieldGroup label="Est. duration">
                <Select value={String(form.estimatedDurationMinutes)} onValueChange={(v) => setForm({ ...form, estimatedDurationMinutes: Number(v) })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DURATIONS.map((d) => (
                      <SelectItem key={d} value={String(d)}>
                        {d < 60 ? `${d} min` : `${d / 60} hr`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldGroup>
            </div>

            <FieldGroup label="Checklist steps" hint="Optional — break the task into steps employees check off.">
              <ChecklistBuilder items={form.checklist} onChange={(c) => setForm({ ...form, checklist: c })} />
            </FieldGroup>

            <FieldGroup label="Manager notes" htmlFor="mgr-notes" hint="Visible to whoever is assigned this task.">
              <Textarea id="mgr-notes" value={form.managerNotes} onChange={(e) => setForm({ ...form, managerNotes: e.target.value })} rows={2} />
            </FieldGroup>

            <FieldGroup label="Reference attachment" hint="Simulated — attaches a filename only, no upload in this demo.">
              <label className="flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-dashed border-ink-300 px-4 py-2.5 text-sm text-ink-600 hover:bg-ink-50">
                <Paperclip className="size-4" />
                {fileName ?? 'Attach reference file'}
                <input
                  type="file"
                  className="sr-only"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) {
                      setFileName(f.name)
                      setForm({ ...form, referenceAttachment: f.name })
                    }
                  }}
                />
              </label>
            </FieldGroup>

            <div className="grid gap-3 rounded-lg border border-ink-200 p-4 sm:grid-cols-2">
              <label className="flex items-center gap-3 text-sm font-medium text-ink-800">
                <Switch checked={form.requirePhoto} onCheckedChange={(v) => setForm({ ...form, requirePhoto: v })} />
                Require completion photo
              </label>
              <label className="flex items-center gap-3 text-sm font-medium text-ink-800">
                <Switch checked={form.requireApproval} onCheckedChange={(v) => setForm({ ...form, requireApproval: v })} />
                Require manager approval
              </label>
              <label className="flex items-center gap-3 text-sm font-medium text-ink-800 sm:col-span-2">
                <Switch
                  checked={form.recurring}
                  onCheckedChange={(v) =>
                    setForm({
                      ...form,
                      recurring: v,
                      recurrence: v ? (form.recurrence ?? ({ frequency: 'Daily', startDate: form.startDate, endType: 'never' } as RecurrenceConfig)) : undefined,
                    })
                  }
                />
                Recurring task
              </label>
            </div>

            {form.recurring && form.recurrence && (
              <RecurrenceEditor value={form.recurrence} onChange={(r) => setForm({ ...form, recurrence: r })} />
            )}

            <FieldGroup label="Assign to" required>
              <AssignmentPicker value={form.assignment} onChange={(a) => setForm({ ...form, assignment: a })} />
              {errors.assignment && <p className="text-xs text-brand-600">{errors.assignment}</p>}
            </FieldGroup>

            <FieldGroup label="Reminders and escalation">
              <ReminderSettingsForm value={form.reminders} onChange={(r) => setForm({ ...form, reminders: r })} />
            </FieldGroup>

            <div className="flex justify-end gap-3 border-t border-ink-100 pt-5">
              <Button variant="secondary" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Create Task</Button>
            </div>
          </div>
        </Modal>
      )}
    </Dialog>
  )
}
