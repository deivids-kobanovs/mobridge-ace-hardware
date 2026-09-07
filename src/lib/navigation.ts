export type ManagerPage =
  | 'overview'
  | 'tasks'
  | 'recurring'
  | 'templates'
  | 'policies'
  | 'handbook'
  | 'employees'
  | 'reports'
  | 'notifications'
  | 'settings'

export const MANAGER_NAV: { id: ManagerPage; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'tasks', label: 'All Tasks' },
  { id: 'recurring', label: 'Recurring Tasks' },
  { id: 'templates', label: 'Templates' },
  { id: 'policies', label: 'Policies & Procedures' },
  { id: 'handbook', label: 'Handbook' },
  { id: 'employees', label: 'Employees' },
  { id: 'reports', label: 'Reports' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'settings', label: 'Settings' },
]
