import { GripVertical, Plus, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function ChecklistBuilder({ items, onChange }: { items: string[]; onChange: (items: string[]) => void }) {
  const [draft, setDraft] = useState('')

  function addItem() {
    const text = draft.trim()
    if (!text) return
    onChange([...items, text])
    setDraft('')
  }

  function updateItem(i: number, text: string) {
    onChange(items.map((it, idx) => (idx === i ? text : it)))
  }

  function removeItem(i: number) {
    onChange(items.filter((_, idx) => idx !== i))
  }

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <GripVertical className="size-4 shrink-0 text-ink-300" aria-hidden="true" />
          <Input value={item} onChange={(e) => updateItem(i, e.target.value)} aria-label={`Checklist step ${i + 1}`} />
          <button
            type="button"
            onClick={() => removeItem(i)}
            className="shrink-0 rounded-md p-2 text-ink-400 hover:bg-ink-100 hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            aria-label={`Remove step: ${item}`}
          >
            <X className="size-4" />
          </button>
        </div>
      ))}
      <div className="flex items-center gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addItem()
            }
          }}
          placeholder="Add a checklist step…"
        />
        <Button type="button" variant="secondary" onClick={addItem}>
          <Plus className="size-4" />
          Add
        </Button>
      </div>
    </div>
  )
}
