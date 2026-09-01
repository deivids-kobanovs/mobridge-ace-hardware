import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, Modal } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/input'

export function PromptDialog({
  open,
  onOpenChange,
  title,
  description,
  label,
  placeholder,
  confirmLabel = 'Submit',
  required = true,
  danger = false,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  title: string
  description?: string
  label: string
  placeholder?: string
  confirmLabel?: string
  required?: boolean
  danger?: boolean
  onSubmit: (text: string) => void
}) {
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  function reset() {
    setText('')
    setError('')
  }

  function handleSubmit() {
    if (required && !text.trim()) {
      setError('This field is required.')
      return
    }
    onSubmit(text.trim())
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
        <Modal title={title} description={description} size="sm">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-ink-800">{label}</label>
              <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={placeholder} rows={3} autoFocus />
              {error && <p className="text-xs text-brand-600">{error}</p>}
            </div>
            <div className="flex justify-end gap-3 border-t border-ink-100 pt-4">
              <Button variant="secondary" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button variant={danger ? 'danger' : 'primary'} onClick={handleSubmit}>
                {confirmLabel}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </Dialog>
  )
}
