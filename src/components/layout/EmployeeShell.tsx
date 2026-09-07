import { BookOpen, Home, ShieldCheck, Wrench } from 'lucide-react'
import { useState } from 'react'
import { EmployeeProfileModal } from '@/components/employees/EmployeeProfileModal'
import { RoleSwitcher } from '@/components/layout/RoleSwitcher'
import { NotificationBell } from '@/components/notifications/NotificationBell'
import { TaskDetailPanel } from '@/components/tasks/TaskDetailPanel'
import { Avatar } from '@/components/ui/avatar'
import { COMPANY_NAME, findEmployee } from '@/data/employees'
import { cn } from '@/lib/utils'
import { HandbookPage } from '@/pages/Handbook'
import { EmployeeHome } from '@/pages/EmployeeHome'
import { Policies } from '@/pages/Policies'
import { useApp } from '@/store/AppContext'

type EmployeeTab = 'home' | 'policies' | 'handbook'

const TABS: { id: EmployeeTab; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'policies', label: 'Policies', icon: ShieldCheck },
  { id: 'handbook', label: 'Handbook', icon: BookOpen },
]

export function EmployeeShell() {
  const { currentEmployeeId } = useApp()
  const employee = findEmployee(currentEmployeeId)
  const [openTaskId, setOpenTaskId] = useState<string | null>(null)
  const [tab, setTab] = useState<EmployeeTab>('home')
  const [policyDeepLinkId, setPolicyDeepLinkId] = useState<string | null>(null)
  const [profileOpen, setProfileOpen] = useState(false)

  function goToPolicy(policyId?: string) {
    setPolicyDeepLinkId(policyId ?? null)
    setTab('policies')
  }

  return (
    <div className="min-h-screen bg-ink-50">
      <header className="sticky top-0 z-30 border-b border-ink-200 bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-ink-50">
            <Wrench className="size-5" />
          </span>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-bold tracking-tight text-ink-900">Workgrid</p>
            <p className="truncate text-xs text-ink-500">{COMPANY_NAME}</p>
          </div>
          {employee && <NotificationBell scope="employee" employeeId={employee.id} onOpenTask={setOpenTaskId} />}
          {employee && (
            <button onClick={() => setProfileOpen(true)} aria-label="My profile" className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
              <Avatar initials={employee.initials} color={employee.color} />
            </button>
          )}
        </div>
        <div className="mx-auto max-w-2xl px-4 pb-3">
          <RoleSwitcher />
        </div>
        <nav className="mx-auto flex max-w-2xl gap-1 border-t border-ink-100 px-4 py-1.5" aria-label="Sections">
          {TABS.map((tb) => (
            <button
              key={tb.id}
              onClick={() => {
                setTab(tb.id)
                if (tb.id !== 'policies') setPolicyDeepLinkId(null)
              }}
              className={cn(
                'flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors',
                tab === tb.id ? 'bg-brand-50 text-brand-700' : 'text-ink-500 hover:bg-ink-100',
              )}
            >
              <tb.icon className="size-3.5" />
              {tb.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        {tab === 'home' && <EmployeeHome onOpenTask={setOpenTaskId} onGoToPolicies={goToPolicy} onGoToHandbook={() => setTab('handbook')} />}
        {tab === 'policies' && <Policies key={policyDeepLinkId ?? 'list'} initialPolicyId={policyDeepLinkId} />}
        {tab === 'handbook' && <HandbookPage />}
      </main>

      <TaskDetailPanel taskId={openTaskId} onClose={() => setOpenTaskId(null)} />
      <EmployeeProfileModal open={profileOpen} onOpenChange={setProfileOpen} employee={employee ?? null} />
    </div>
  )
}
