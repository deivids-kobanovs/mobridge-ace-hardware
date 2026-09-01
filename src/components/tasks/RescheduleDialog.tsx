import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, Modal } from '@/components/ui/dialog'
import { FieldGroup, Input } from '@/components/ui/input'
import { todayISO } from '@/lib/date'

export function RescheduleDialog({
  open,
  onOpenChange,
  initialDate,
  initialTime,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  initialDate: string
  initialTime: string
  onSubmit: (dueDate: string, dueTime: string) => void
}) {
  const [date, setDate] = useState(initialDate)
  const [time, setTime] = useState(initialTime)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <Modal title="Reschedule Task" size="sm">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FieldGroup label="New due date">
                <Input type="date" value={date} min={todayISO()} onChange={(e) => setDate(e.target.value)} />
              </FieldGroup>
              <FieldGroup label="New due time">
                <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
              </FieldGroup>
            </div>
            <div className="flex justify-end gap-3 border-t border-ink-100 pt-4">
              <Button variant="secondary" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  onSubmit(date, time)
                  onOpenChange(false)
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </Dialog>
  )
}
