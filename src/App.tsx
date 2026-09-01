import { Toaster } from 'sonner'
import { EmployeeShell } from '@/components/layout/EmployeeShell'
import { ManagerShell } from '@/components/layout/ManagerShell'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppProvider, useApp } from '@/store/AppContext'

function Shell() {
  const { role } = useApp()
  return role === 'manager' ? <ManagerShell /> : <EmployeeShell />
}

export default function App() {
  return (
    <AppProvider>
      <TooltipProvider delayDuration={200}>
        <Shell />
        <Toaster position="top-right" richColors closeButton toastOptions={{ className: 'animate-toast-in' }} />
      </TooltipProvider>
    </AppProvider>
  )
}
