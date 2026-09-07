import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, Modal } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useApp } from '@/store/AppContext'

export function CategoryManageModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { policyCategories, createPolicyCategory, renamePolicyCategory, deletePolicyCategory } = useApp()
  const [newName, setNewName] = useState('')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <Modal title="Manage Categories" description="Organize how policies are grouped in the library." size="sm">
          <div className="space-y-2">
            {policyCategories.map((c) => (
              <div key={c.id} className="flex items-center gap-2">
                <Input value={c.name} onChange={(e) => renamePolicyCategory(c.id, e.target.value)} />
                {!c.builtIn && (
                  <button
                    onClick={() => deletePolicyCategory(c.id)}
                    className="shrink-0 rounded-md p-2 text-ink-400 hover:bg-ink-100 hover:text-brand-600"
                    aria-label={`Delete ${c.name}`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 border-t border-ink-100 pt-4">
            <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="New category name…" />
            <Button
              variant="secondary"
              onClick={() => {
                if (!newName.trim()) return
                createPolicyCategory(newName.trim())
                setNewName('')
              }}
            >
              <Plus className="size-4" />
              Add
            </Button>
          </div>
        </Modal>
      )}
    </Dialog>
  )
}
