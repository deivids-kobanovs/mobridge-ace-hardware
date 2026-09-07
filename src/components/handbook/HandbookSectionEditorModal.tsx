import { useEffect, useState } from 'react'
import { RichTextEditor } from '@/components/content/RichTextEditor'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/checkbox'
import { Dialog, Modal } from '@/components/ui/dialog'
import { FieldGroup, Input } from '@/components/ui/input'
import { useApp } from '@/store/AppContext'
import type { HandbookSection } from '@/types'

export function HandbookSectionEditorModal({ open, onOpenChange, section }: { open: boolean; onOpenChange: (v: boolean) => void; section: HandbookSection | null }) {
  const { updateHandbookSectionDraft } = useApp()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [requiresAck, setRequiresAck] = useState(false)

  useEffect(() => {
    if (open && section) {
      setTitle(section.draftTitle ?? section.title)
      setContent(section.draftContent ?? section.content)
      setRequiresAck(section.requiresAcknowledgement)
    }
  }, [open, section])

  if (!section) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <Modal
          title="Edit Section"
          description={section.status === 'Published' ? 'Changes save as a draft — employees keep seeing the published version until you publish.' : undefined}
          size="xl"
        >
          <div className="space-y-5">
            <FieldGroup label="Section title" required>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </FieldGroup>
            <FieldGroup label="Content">
              <RichTextEditor value={content} onChange={setContent} minRows={12} />
            </FieldGroup>
            <label className="flex items-center gap-3 rounded-lg border border-ink-200 p-4 text-sm font-medium text-ink-800">
              <Switch checked={requiresAck} onCheckedChange={setRequiresAck} />
              Require employees to acknowledge this chapter specifically
            </label>
            <div className="flex justify-end gap-3 border-t border-ink-100 pt-4">
              <Button variant="secondary" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  updateHandbookSectionDraft(section.id, { title, content, requiresAcknowledgement: requiresAck })
                  onOpenChange(false)
                }}
              >
                Save Draft
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </Dialog>
  )
}
