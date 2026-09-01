import { addDays, todayISO, weekdayName } from '@/lib/date'

export interface DailyStat {
  date: string
  day: string
  completionRate: number
  onTime: number
  late: number
}

const today = todayISO()

const RATES = [88, 91, 79, 94, 86, 97, 72]
const ONTIME = [80, 85, 70, 90, 78, 92, 60]

export const WEEKLY_STATS: DailyStat[] = Array.from({ length: 7 }).map((_, i) => {
  const date = addDays(today, i - 6)
  return {
    date,
    day: weekdayName(date, true),
    completionRate: RATES[i],
    onTime: ONTIME[i],
    late: RATES[i] - ONTIME[i],
  }
})

export const DEPARTMENT_COMPLETION = [
  { department: 'Front End', rate: 94 },
  { department: 'Receiving', rate: 81 },
  { department: 'Paint', rate: 90 },
  { department: 'Lawn & Garden', rate: 96 },
  { department: 'Hardware', rate: 87 },
  { department: 'Plumbing & Electrical', rate: 92 },
]

export const EMPLOYEE_COMPLETION = [
  { name: 'Sarah Miller', rate: 96, completed: 24, blocked: 1 },
  { name: 'Mike Johnson', rate: 82, completed: 18, blocked: 3 },
  { name: 'Jordan Lee', rate: 93, completed: 21, blocked: 1 },
  { name: 'Emily Davis', rate: 88, completed: 20, blocked: 2 },
  { name: 'Carlos Nunez', rate: 90, completed: 19, blocked: 1 },
  { name: 'Priya Patel', rate: 97, completed: 15, blocked: 0 },
]

export const BLOCKED_REASONS_STATS = [
  { reason: 'Missing supplies', count: 14 },
  { reason: 'Equipment unavailable', count: 9 },
  { reason: 'Waiting for employee', count: 6 },
  { reason: 'Customer activity', count: 5 },
  { reason: 'Safety concern', count: 4 },
  { reason: 'Unclear instructions', count: 3 },
]

export const APPROVAL_TIME_STATS = {
  averageMinutes: 22,
  medianMinutes: 14,
  underFifteenPercent: 58,
}

export const RECURRING_PERFORMANCE = [
  { name: 'Store Opening Checklist', completionRate: 98, onTimeRate: 95 },
  { name: 'Store Closing Checklist', completionRate: 91, onTimeRate: 84 },
  { name: 'Garden Center Opening', completionRate: 97, onTimeRate: 96 },
  { name: 'Receiving Delivery Checklist', completionRate: 85, onTimeRate: 74 },
  { name: 'Weekly Safety Inspection', completionRate: 100, onTimeRate: 90 },
]

export const CHECKLIST_COMPLIANCE = {
  opening: { onTime: 96, total: 30 },
  closing: { onTime: 88, total: 30 },
}
