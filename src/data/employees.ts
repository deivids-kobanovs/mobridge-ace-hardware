import type { Employee } from '@/types'

export const COMPANY_ID = 'mobridge_ace_hardware'
export const LOCATION_ID = 'main_store'
export const COMPANY_NAME = 'Mobridge Ace Hardware'
export const COMPANY_DOMAIN = 'mobridgeacehardware.com'

export const MANAGER: Employee = {
  id: 'mgr_alex',
  name: 'Alex Rivera',
  role: 'Store Manager',
  department: 'Store Wide',
  shiftLabel: '7:00 AM – 4:00 PM',
  shiftStatus: 'On Shift',
  initials: 'AR',
  color: 'bg-brand-600',
  isManager: true,
  email: 'alex.rivera@mobridgeacehardware.com',
  preferredLanguage: 'en',
}

export const ASSISTANT_MANAGER: Employee = {
  id: 'mgr_dana',
  name: 'Dana Whitfield',
  role: 'Assistant Manager',
  department: 'Store Wide',
  shiftLabel: '10:00 AM – 7:00 PM',
  shiftStatus: 'On Shift',
  initials: 'DW',
  color: 'bg-ink-700',
  isManager: true,
  email: 'dana.whitfield@mobridgeacehardware.com',
  preferredLanguage: 'en',
}

export const EMPLOYEES: Employee[] = [
  {
    id: 'emp_sarah',
    name: 'Sarah Miller',
    role: 'Front End Associate',
    department: 'Front End',
    shiftLabel: '7:00 AM – 3:00 PM',
    shiftStatus: 'On Shift',
    initials: 'SM',
    color: 'bg-rose-500',
    email: 'sarah.miller@mobridgeacehardware.com',
    preferredLanguage: 'en',
  },
  {
    id: 'emp_mike',
    name: 'Mike Johnson',
    role: 'Receiving Associate',
    department: 'Receiving',
    shiftLabel: '6:00 AM – 2:00 PM',
    shiftStatus: 'On Shift',
    initials: 'MJ',
    color: 'bg-amber-600',
    email: 'mike.johnson@mobridgeacehardware.com',
    preferredLanguage: 'es',
  },
  {
    id: 'emp_jordan',
    name: 'Jordan Lee',
    role: 'Paint Department Lead',
    department: 'Paint',
    shiftLabel: '9:00 AM – 5:00 PM',
    shiftStatus: 'On Shift',
    initials: 'JL',
    color: 'bg-sky-600',
    email: 'jordan.lee@mobridgeacehardware.com',
    preferredLanguage: 'no',
  },
  {
    id: 'emp_emily',
    name: 'Emily Davis',
    role: 'Garden Center Associate',
    department: 'Lawn & Garden',
    shiftLabel: '8:00 AM – 4:00 PM',
    shiftStatus: 'On Break',
    initials: 'ED',
    color: 'bg-emerald-600',
    email: 'emily.davis@mobridgeacehardware.com',
    preferredLanguage: 'pl',
  },
  {
    id: 'emp_carlos',
    name: 'Carlos Nunez',
    role: 'Hardware Associate',
    department: 'Hardware',
    shiftLabel: '11:00 AM – 7:00 PM',
    shiftStatus: 'On Shift',
    initials: 'CN',
    color: 'bg-violet-600',
    email: 'carlos.nunez@mobridgeacehardware.com',
    preferredLanguage: 'es',
  },
  {
    id: 'emp_priya',
    name: 'Priya Patel',
    role: 'Plumbing & Electrical Associate',
    department: 'Plumbing & Electrical',
    shiftLabel: '9:00 AM – 5:00 PM',
    shiftStatus: 'Off Shift',
    initials: 'PP',
    color: 'bg-teal-600',
    email: 'priya.patel@mobridgeacehardware.com',
    preferredLanguage: 'ro',
  },
]

export const MANAGERS: Employee[] = [MANAGER, ASSISTANT_MANAGER]
export const ALL_PEOPLE: Employee[] = [...MANAGERS, ...EMPLOYEES]

export function findEmployee(id?: string): Employee | undefined {
  if (!id) return undefined
  return ALL_PEOPLE.find((e) => e.id === id)
}

export function employeeName(id?: string): string {
  if (!id) return 'Unassigned'
  return findEmployee(id)?.name ?? 'Unknown'
}
