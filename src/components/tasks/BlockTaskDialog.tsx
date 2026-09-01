import { Camera } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, Modal } from '@/components/ui/dialog'
import { FieldGroup, Textarea } from '@/components/ui/input'
import { BLOCK_REASONS, type BlockReasonCategory } from '@/types'
import { cn } from '@/lib/utils'

export function BlockTaskDialog({
  open,
  onOpenChange,
  taskTitle,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  taskTitle: string
  onSubmit: (opts: { reason: BlockReasonCategory; explanation: string; photo: boolean }) => void
}) {
  const [reason, setReason] = useState<BlockReasonCategory | null>(null)
  const [explanation, setExplanation] = useState('')
  const [photo, setPhoto] = useState(false)
  const [error, setError] = useState('')

  function reset() {
    setReason(null)
    setExplanation('')
    setPhoto(false)
    setError('')
  }

  function handleSubmit() {
    if (!reason) {
      setError('Choose a reason category.')
      return
    }
    if (!explanation.trim()) {
      setError('Please explain what’s blocking this task.')
      return
    }
    onSubmit({ reason, explanation: explanation.trim(), photo })
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
        <Modal title="Report a Problem" description={taskTitle} size="md">
          <div className="space-y-5">
            <FieldGroup label="What's blocking this task?" required>
              <div className="grid gap-2 sm:grid-cols-2">
                {BLOCK_REASONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setReason(r)}
                    className={cn(
                      'rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                      reason === r ? 'border-brand-500 bg-brand-50 text-brand-800' : 'border-ink-200 text-ink-600 hover:bg-ink-50',
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </FieldGroup>

            <FieldGroup label="Explain what's happening" required htmlFor="block-explain">
              <Textarea id="block-explain" value={explanation} onChange={(e) => setExplanation(e.target.value)} rows={3} placeholder="Give your manager enough detail to help fast…" />
            </FieldGroup>

            <label className="flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-dashed border-ink-300 px-4 py-2.5 text-sm text-ink-600 hover:bg-ink-50">
              <Camera className="size-4" />
              {photo ? 'Photo attached' : 'Attach a photo (optional, simulated)'}
              <input
                type="checkbox"
                className="sr-only"
                checked={photo}
                onChange={(e) => setPhoto(e.target.checked)}
              />
            </label>

            {error && <p className="text-sm text-brand-600">{error}</p>}

            <div className="flex justify-end gap-3 border-t border-ink-100 pt-4">
              <Button variant="secondary" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Mark as Blocked</Button>
            </div>
          </div>
        </Modal>
      )}
    </Dialog>
  )
}
