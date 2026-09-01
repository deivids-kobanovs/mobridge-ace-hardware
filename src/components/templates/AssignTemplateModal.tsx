import { useEffect, useState } from 'react'
import { AssignmentPicker } from '@/components/tasks/AssignmentPicker'
import { Button } from '@/components/ui/button'
import { Dialog, Modal } from '@/components/ui/dialog'
import { FieldGroup, Input } from '@/components/ui/input'
import { addDays, todayISO } from '@/lib/date'
import { useApp } from '@/store/AppContext'
import type { Assignment, TaskTemplate } from '@/types'

export function AssignTemplateModal({ template, onOpenChange }: { template: TaskTemplate | null; onOpenChange: (v: boolean) => void }) {
  const { assignTemplate } = useApp()
  const [assignment, setAssignment] = useState<Assignment>({ type: 'employee', employeeIds: [] })
  const [dueDate, setDueDate] = useState(todayISO())
  const [dueTime, setDueTime] = useState('09:00')
  const [error, setError] = useState('')

  useEffect(() => {
    if (template) {
      setAssignment(template.defaultAssignment)
      setDueDate(todayISO())
      setDueTime(template.defaultDueTime)
      setError('')
    }
  }, [template])

  function handleSubmit() {
    if ((assignment.type === 'employee' && assignment.employeeIds.length !== 1) || (assignment.type === 'multiple' && assignment.employeeIds.length < 2)) {
      setError('Choose who this task is assigned to.')
      return
    }
    if (!template) return
    assignTemplate(template.id, { assignment, dueDate, dueTime })
    onOpenChange(false)
  }

  return (
    <Dialog open={!!template} onOpenChange={onOpenChange}>
      {template && (
        <Modal title={`Assign "${template.name}"`} description="Schedule this template as a task for today or a future shift." size="lg">
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <FieldGroup label="Due date">
                <Input type="date" value={dueDate} min={todayISO()} onChange={(e) => setDueDate(e.target.value)} />
              </FieldGroup>
              <FieldGroup label="Due time">
                <Input type="time" value={dueTime} onChange={(e) => setDueTime(e.target.value)} />
              </FieldGroup>
            </div>
            <div className="flex flex-wrap gap-2">
              {[0, 1, 2].map((n) => (
                <Button key={n} type="button" variant="outline" size="sm" onClick={() => setDueDate(addDays(todayISO(), n))}>
                  {n === 0 ? 'Today' : n === 1 ? 'Tomorrow' : addDays(todayISO(), n)}
                </Button>
              ))}
            </div>
            <FieldGroup label="Assign to">
              <AssignmentPicker value={assignment} onChange={setAssignment} />
              {error && <p className="text-xs text-brand-600">{error}</p>}
            </FieldGroup>
            <div className="flex justify-end gap-3 border-t border-ink-100 pt-4">
              <Button variant="secondary" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Assign Task</Button>
            </div>
          </div>
        </Modal>
      )}
    </Dialog>
  )
}
