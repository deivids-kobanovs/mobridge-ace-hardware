import { Camera } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, Modal } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/input'

export function CompleteTaskDialog({
  open,
  onOpenChange,
  taskTitle,
  requirePhoto,
  requireApproval,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  taskTitle: string
  requirePhoto: boolean
  requireApproval: boolean
  onConfirm: (opts: { note?: string; photo?: boolean }) => void
}) {
  const [note, setNote] = useState('')
  const [photo, setPhoto] = useState(false)
  const [error, setError] = useState('')

  function reset() {
    setNote('')
    setPhoto(false)
    setError('')
  }

  function handleConfirm() {
    if (requirePhoto && !photo) {
      setError('A completion photo is required for this task.')
      return
    }
    onConfirm({ note: note.trim() || undefined, photo })
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
        <Modal
          title={requireApproval ? 'Submit for Approval' : 'Complete Task'}
          description={taskTitle}
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-sm text-ink-600">
              {requireApproval
                ? 'This task requires manager approval. Add any notes, then submit — your manager will review before it counts as complete.'
                : 'Confirm this task is finished. It will move to your completed list.'}
            </p>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-ink-800">Completion note (optional)</label>
              <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Anything your manager should know…" />
            </div>
            <label className="flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-dashed border-ink-300 px-4 py-2.5 text-sm text-ink-600 hover:bg-ink-50">
              <Camera className="size-4" />
              {photo ? 'Photo attached' : `Attach completion photo${requirePhoto ? ' (required)' : ' (optional, simulated)'}`}
              <input type="checkbox" className="sr-only" checked={photo} onChange={(e) => setPhoto(e.target.checked)} />
            </label>
            {error && <p className="text-sm text-brand-600">{error}</p>}
            <div className="flex justify-end gap-3 border-t border-ink-100 pt-4">
              <Button variant="secondary" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirm}>{requireApproval ? 'Submit for Approval' : 'Mark Complete'}</Button>
            </div>
          </div>
        </Modal>
      )}
    </Dialog>
  )
}
