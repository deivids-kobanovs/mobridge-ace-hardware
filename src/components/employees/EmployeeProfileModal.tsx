import { Globe } from 'lucide-react'
import { LanguagePicker } from '@/components/content/LanguagePicker'
import { Avatar } from '@/components/ui/avatar'
import { Dialog, Modal } from '@/components/ui/dialog'
import { FieldGroup } from '@/components/ui/input'
import { useApp } from '@/store/AppContext'
import type { Employee } from '@/types'

export function EmployeeProfileModal({ open, onOpenChange, employee }: { open: boolean; onOpenChange: (v: boolean) => void; employee: Employee | null }) {
  const { getEmployeeLanguage, setEmployeeLanguage } = useApp()
  if (!employee) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <Modal title="My Profile" size="sm">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Avatar initials={employee.initials} color={employee.color} size="lg" />
              <div>
                <p className="text-sm font-semibold text-ink-900">{employee.name}</p>
                <p className="text-xs text-ink-500">
                  {employee.role} · {employee.department}
                </p>
              </div>
            </div>
            <FieldGroup label="Preferred language" hint="Tasks, policies, and the handbook are automatically shown to you in this language when available.">
              <div className="flex items-center gap-2">
                <Globe className="size-4 shrink-0 text-ink-400" />
                <LanguagePicker value={getEmployeeLanguage(employee.id)} onChange={(v) => setEmployeeLanguage(employee.id, v)} className="flex-1" />
              </div>
            </FieldGroup>
          </div>
        </Modal>
      )}
    </Dialog>
  )
}
