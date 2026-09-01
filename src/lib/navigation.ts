export type ManagerPage = 'overview' | 'tasks' | 'recurring' | 'templates' | 'employees' | 'reports' | 'notifications' | 'settings'

export const MANAGER_NAV: { id: ManagerPage; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'tasks', label: 'All Tasks' },
  { id: 'recurring', label: 'Recurring Tasks' },
  { id: 'templates', label: 'Templates' },
  { id: 'employees', label: 'Employees' },
  { id: 'reports', label: 'Reports' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'settings', label: 'Settings' },
]
