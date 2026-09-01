import { Plus } from 'lucide-react'
import { useState } from 'react'
import { AssignTemplateModal } from '@/components/templates/AssignTemplateModal'
import { TemplateCard } from '@/components/templates/TemplateCard'
import { TemplateFormModal } from '@/components/templates/TemplateFormModal'
import { TemplatePreviewModal } from '@/components/templates/TemplatePreviewModal'
import { Button } from '@/components/ui/button'
import { useApp } from '@/store/AppContext'
import type { TaskTemplate } from '@/types'

export function Templates() {
  const { templates, duplicateTemplate } = useApp()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<TaskTemplate | null>(null)
  const [previewing, setPreviewing] = useState<TaskTemplate | null>(null)
  const [assigning, setAssigning] = useState<TaskTemplate | null>(null)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-ink-900">Templates</h1>
          <p className="text-sm text-ink-500">Reusable checklists for opening, closing, and recurring store routines.</p>
        </div>
        <Button
          onClick={() => {
            setEditing(null)
            setFormOpen(true)
          }}
        >
          <Plus className="size-4" />
          New Template
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {templates.map((t) => (
          <TemplateCard
            key={t.id}
            template={t}
            onPreview={() => setPreviewing(t)}
            onEdit={() => {
              setEditing(t)
              setFormOpen(true)
            }}
            onDuplicate={() => duplicateTemplate(t.id)}
            onAssign={() => setAssigning(t)}
          />
        ))}
      </div>

      <TemplateFormModal open={formOpen} onOpenChange={setFormOpen} template={editing} />
      <TemplatePreviewModal template={previewing} onOpenChange={(v) => !v && setPreviewing(null)} />
      <AssignTemplateModal template={assigning} onOpenChange={(v) => !v && setAssigning(null)} />
    </div>
  )
}
