import { ChevronDown, UserCog, Users } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { EMPLOYEES } from '@/data/employees'
import { cn } from '@/lib/utils'
import { useApp } from '@/store/AppContext'

export function RoleSwitcher() {
  const { role, setRole, currentEmployeeId, setCurrentEmployeeId } = useApp()
  const currentEmployee = EMPLOYEES.find((e) => e.id === currentEmployeeId)

  return (
    <div className="flex items-center gap-2">
      <div className="flex rounded-lg border border-ink-200 bg-ink-50 p-0.5 text-xs font-semibold">
        <button
          onClick={() => setRole('manager')}
          className={cn(
            'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
            role === 'manager' ? 'bg-card text-brand-700 shadow-sm' : 'text-ink-500 hover:text-ink-800',
          )}
          aria-pressed={role === 'manager'}
        >
          <UserCog className="size-3.5" />
          Owner/Manager
        </button>
        <button
          onClick={() => setRole('employee')}
          className={cn(
            'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
            role === 'employee' ? 'bg-card text-brand-700 shadow-sm' : 'text-ink-500 hover:text-ink-800',
          )}
          aria-pressed={role === 'employee'}
        >
          <Users className="size-3.5" />
          Employee
        </button>
      </div>

      {role === 'employee' && (
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-lg border border-ink-200 bg-card px-2.5 py-1.5 text-xs font-semibold text-ink-700 shadow-sm hover:bg-ink-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
            {currentEmployee?.name ?? 'Choose employee'}
            <ChevronDown className="size-3.5 opacity-60" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>View as</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {EMPLOYEES.map((e) => (
              <DropdownMenuItem key={e.id} onSelect={() => setCurrentEmployeeId(e.id)}>
                <span className="flex-1">{e.name}</span>
                <span className="text-xs text-ink-400">{e.department}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
