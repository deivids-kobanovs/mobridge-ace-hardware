import { useEffect, useState } from 'react'
import { RichTextEditor } from '@/components/content/RichTextEditor'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/checkbox'
import { Dialog, Modal } from '@/components/ui/dialog'
import { FieldGroup, Input, Textarea } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useApp } from '@/store/AppContext'
import type { Policy, PolicyCategoryId } from '@/types'

interface FormState {
  title: string
  description: string
  categoryId: PolicyCategoryId | string
  content: string
  requiresAcknowledgement: boolean
}

function emptyForm(categoryId: string): FormState {
  return { title: '', description: '', categoryId, content: '', requiresAcknowledgement: false }
}

export function PolicyEditorModal({ open, onOpenChange, policy }: { open: boolean; onOpenChange: (v: boolean) => void; policy: Policy | null }) {
  const { policyCategories, createPolicy, updatePolicyDraft } = useApp()
  const [form, setForm] = useState<FormState>(emptyForm(policyCategories[0]?.id ?? 'general'))
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      if (policy) {
        setForm({
          title: policy.draftTitle ?? policy.title,
          description: policy.draftDescription ?? policy.description,
          categoryId: policy.draftCategoryId ?? policy.categoryId,
          content: policy.draftContent ?? policy.content,
          requiresAcknowledgement: policy.requiresAcknowledgement,
        })
      } else {
        setForm(emptyForm(policyCategories[0]?.id ?? 'general'))
      }
      setError('')
    }
  }, [open, policy, policyCategories])

  function handleSave() {
    if (!form.title.trim()) {
      setError('Give this policy a title.')
      return
    }
    if (policy) {
      updatePolicyDraft(policy.id, form)
    } else {
      createPolicy(form)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <Modal
          title={policy ? 'Edit Policy' : 'New Policy'}
          description={policy?.status === 'Published' ? 'Changes are saved as a draft — employees keep seeing the current published version until you publish.' : undefined}
          size="xl"
        >
          <div className="space-y-5">
            <FieldGroup label="Title" required>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Workshop Opening Procedure" />
            </FieldGroup>
            <FieldGroup label="Short description" hint="Shown in the policy library list.">
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
            </FieldGroup>
            <FieldGroup label="Category">
              <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {policyCategories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldGroup>
            <FieldGroup label="Policy content">
              <RichTextEditor value={form.content} onChange={(v) => setForm({ ...form, content: v })} minRows={14} />
            </FieldGroup>
            <label className="flex items-center gap-3 rounded-lg border border-ink-200 p-4 text-sm font-medium text-ink-800">
              <Switch checked={form.requiresAcknowledgement} onCheckedChange={(v) => setForm({ ...form, requiresAcknowledgement: v })} />
              Require employees to acknowledge this policy
            </label>

            {error && <p className="text-sm text-brand-600">{error}</p>}

            <div className="flex justify-end gap-3 border-t border-ink-100 pt-4">
              <Button variant="secondary" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Draft</Button>
            </div>
          </div>
        </Modal>
      )}
    </Dialog>
  )
}
