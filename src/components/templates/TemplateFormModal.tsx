import { useEffect, useState } from 'react'
import { AssignmentPicker } from '@/components/tasks/AssignmentPicker'
import { ChecklistBuilder } from '@/components/tasks/ChecklistBuilder'
import { RecurrenceEditor } from '@/components/tasks/RecurrenceEditor'
import { ReminderSettingsForm } from '@/components/tasks/ReminderSettingsForm'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/checkbox'
import { Dialog, Modal } from '@/components/ui/dialog'
import { FieldGroup, Input, Textarea } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { defaultReminders, steps } from '@/data/templates'
import { todayISO } from '@/lib/date'
import { useApp } from '@/store/AppContext'
import { DEPARTMENTS, PRIORITIES, type Department, type Priority, type RecurrenceConfig, type TaskTemplate } from '@/types'

type FormState = Omit<TaskTemplate, 'id' | 'usageHistory'>

function emptyForm(): FormState {
  return {
    name: '',
    description: '',
    department: 'Store Wide',
    estimatedDurationMinutes: 30,
    defaultPriority: 'Normal',
    checklist: [],
    defaultAssignment: { type: 'employee', employeeIds: [] },
    defaultDueTime: '09:00',
    reminders: defaultReminders(),
    requireApproval: false,
    requirePhoto: false,
    recurring: false,
    recurrence: undefined,
  }
}

export function TemplateFormModal({
  open,
  onOpenChange,
  template,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  template: TaskTemplate | null
}) {
  const { createTemplate, updateTemplate } = useApp()
  const [form, setForm] = useState<FormState>(emptyForm())
  const [checklistStrings, setChecklistStrings] = useState<string[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      if (template) {
        const { id: _id, usageHistory: _usage, ...rest } = template
        void _id
        void _usage
        setForm(rest)
        setChecklistStrings(template.checklist.map((s) => s.text))
      } else {
        setForm(emptyForm())
        setChecklistStrings([])
      }
      setError('')
    }
  }, [open, template])

  function handleSubmit() {
    if (!form.name.trim()) {
      setError('Template name is required.')
      return
    }
    const payload: FormState = { ...form, checklist: steps(checklistStrings) }
    if (template) {
      updateTemplate(template.id, payload)
    } else {
      createTemplate(payload)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <Modal title={template ? 'Edit Template' : 'Create Template'} size="xl">
          <div className="space-y-6">
            <FieldGroup label="Template name" required>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </FieldGroup>
            <FieldGroup label="Description">
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
            </FieldGroup>
            <div className="grid gap-4 sm:grid-cols-3">
              <FieldGroup label="Department">
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
              <FieldGroup label="Default priority">
                <Select value={form.defaultPriority} onValueChange={(p: Priority) => setForm({ ...form, defaultPriority: p })}>
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
              <FieldGroup label="Default due time">
                <Input type="time" value={form.defaultDueTime} onChange={(e) => setForm({ ...form, defaultDueTime: e.target.value })} />
              </FieldGroup>
            </div>
            <FieldGroup label="Estimated duration (minutes)">
              <Input
                type="number"
                min={5}
                value={form.estimatedDurationMinutes}
                onChange={(e) => setForm({ ...form, estimatedDurationMinutes: Number(e.target.value) || 5 })}
                className="w-32"
              />
            </FieldGroup>

            <FieldGroup label="Checklist steps">
              <ChecklistBuilder items={checklistStrings} onChange={setChecklistStrings} />
            </FieldGroup>

            <FieldGroup label="Default assignment">
              <AssignmentPicker value={form.defaultAssignment} onChange={(a) => setForm({ ...form, defaultAssignment: a })} />
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
                      recurrence: v ? (form.recurrence ?? ({ frequency: 'Daily', startDate: todayISO(), endType: 'never' } as RecurrenceConfig)) : undefined,
                    })
                  }
                />
                Recurring schedule
              </label>
            </div>

            {form.recurring && form.recurrence && <RecurrenceEditor value={form.recurrence} onChange={(r) => setForm({ ...form, recurrence: r })} />}

            <FieldGroup label="Reminders and escalation">
              <ReminderSettingsForm value={form.reminders} onChange={(r) => setForm({ ...form, reminders: r })} />
            </FieldGroup>

            {error && <p className="text-sm text-brand-600">{error}</p>}

            <div className="flex justify-end gap-3 border-t border-ink-100 pt-5">
              <Button variant="secondary" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>{template ? 'Save Changes' : 'Create Template'}</Button>
            </div>
          </div>
        </Modal>
      )}
    </Dialog>
  )
}
