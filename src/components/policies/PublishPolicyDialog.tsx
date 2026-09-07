import { Mail } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/checkbox'
import { Dialog, Modal } from '@/components/ui/dialog'
import { FieldGroup, Textarea } from '@/components/ui/input'
import type { Policy } from '@/types'

export function PublishPolicyDialog({
  open,
  onOpenChange,
  policy,
  onPublish,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  policy: Policy | null
  onPublish: (opts: { summaryOfChanges?: string; notify: boolean }) => void
}) {
  const [summary, setSummary] = useState('')
  const [notify, setNotify] = useState(true)
  const isFirstPublish = policy ? policy.versions.length === 0 : true

  function reset() {
    setSummary('')
    setNotify(true)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        if (!v) reset()
      }}
    >
      {open && policy && (
        <Modal title={isFirstPublish ? 'Publish Policy' : 'Publish Update'} description={policy.title} size="sm">
          <div className="space-y-4">
            {!isFirstPublish && (
              <FieldGroup label="What's changed?" hint="Optional — shown to employees so they know what to look for.">
                <Textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={3}
                  placeholder='e.g. "Employees must now photograph the locked storage area before completing the closing checklist."'
                />
              </FieldGroup>
            )}

            <label className="flex items-center gap-3 rounded-lg border border-ink-200 p-3 text-sm font-medium text-ink-800">
              <Switch checked={notify} onCheckedChange={setNotify} />
              Notify all employees by email &amp; in-app
            </label>

            {notify && (
              <p className="flex items-start gap-2 rounded-lg bg-sky-50 px-3 py-2 text-xs text-sky-800">
                <Mail className="mt-0.5 size-3.5 shrink-0" />
                Each employee will receive the update automatically translated into their preferred language. Acknowledgement resets for this new version.
              </p>
            )}

            <div className="flex justify-end gap-3 border-t border-ink-100 pt-4">
              <Button variant="secondary" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  onPublish({ summaryOfChanges: summary.trim() || undefined, notify })
                  onOpenChange(false)
                  reset()
                }}
              >
                {notify ? 'Publish & Notify Employees' : 'Publish'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </Dialog>
  )
}
