import { useState } from 'react'
import { AssignmentPicker } from '@/components/tasks/AssignmentPicker'
import { Button } from '@/components/ui/button'
import { Dialog, Modal } from '@/components/ui/dialog'
import type { Assignment } from '@/types'

export function ReassignDialog({
  open,
  onOpenChange,
  initial,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  initial: Assignment
  onSubmit: (a: Assignment) => void
}) {
  const [assignment, setAssignment] = useState<Assignment>(initial)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <Modal title="Reassign Task" description="Choose who should take this task instead." size="lg">
          <div className="space-y-5">
            <AssignmentPicker value={assignment} onChange={setAssignment} />
            <div className="flex justify-end gap-3 border-t border-ink-100 pt-4">
              <Button variant="secondary" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  onSubmit(assignment)
                  onOpenChange(false)
                }}
              >
                Save Assignment
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </Dialog>
  )
}
