const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function pad(n: number) {
  return n.toString().padStart(2, '0')
}

export function toISODate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function todayISO(): string {
  return toISODate(new Date())
}

export function addDays(iso: string, days: number): string {
  const [y, m, d] = iso.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  dt.setDate(dt.getDate() + days)
  return toISODate(dt)
}

export function isoFromDate(d: Date): string {
  return toISODate(d)
}

export function timeString(hour: number, minute = 0): string {
  const h = ((hour % 24) + 24) % 24
  return `${pad(h)}:${pad(minute)}`
}

export function combineToDate(iso: string, hhmm: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  const [h, min] = hhmm.split(':').map(Number)
  return new Date(y, m - 1, d, h, min, 0, 0)
}

export function formatTime12(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${hour12}:${pad(m)} ${period}`
}

export function weekdayName(iso: string, short = false): string {
  const [y, m, d] = iso.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  return short ? WEEKDAYS_SHORT[dt.getDay()] : WEEKDAYS[dt.getDay()]
}

export function dayOfMonth(iso: string): number {
  return Number(iso.split('-')[2])
}

export function formatDateLong(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return `${WEEKDAYS[new Date(y, m - 1, d).getDay()]}, ${MONTHS[m - 1]} ${d}`
}

export function formatDateShort(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  void y
  return `${MONTHS[m - 1].slice(0, 3)} ${d}`
}

export function formatDateMedium(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return `${MONTHS[m - 1]} ${d}, ${y}`
}

export function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`
}

export function isSameISODate(a: string, b: string): boolean {
  return a === b
}

export function isPast(iso: string, hhmm: string, now: Date = new Date()): boolean {
  return combineToDate(iso, hhmm).getTime() < now.getTime()
}

export function minutesBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 60000)
}

export function relativeDueLabel(iso: string, hhmm: string, now: Date = new Date()): string {
  const due = combineToDate(iso, hhmm)
  const diffMin = minutesBetween(now, due)
  if (diffMin >= 0) {
    if (diffMin < 60) return `Due in ${diffMin} min`
    if (diffMin < 60 * 24) {
      const h = Math.floor(diffMin / 60)
      const m = diffMin % 60
      return m > 0 ? `Due in ${h}h ${m}m` : `Due in ${h}h`
    }
    const days = Math.floor(diffMin / (60 * 24))
    return `Due in ${days} day${days > 1 ? 's' : ''}`
  }
  const overdueMin = Math.abs(diffMin)
  if (overdueMin < 60) return `Overdue by ${overdueMin} min`
  if (overdueMin < 60 * 24) {
    const h = Math.floor(overdueMin / 60)
    return `Overdue by ${h}h`
  }
  const days = Math.floor(overdueMin / (60 * 24))
  return `Overdue by ${days} day${days > 1 ? 's' : ''}`
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

export function formatClockNow(now: Date = new Date()): string {
  return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

export function timeAgo(iso: string, now: Date = new Date()): string {
  const then = new Date(iso)
  const diffMin = minutesBetween(then, now)
  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24) return `${diffH}h ago`
  const diffD = Math.floor(diffH / 24)
  return `${diffD}d ago`
}

export function formatTimestamp(iso?: string): string {
  if (!iso) return 'unknown time'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return 'unknown time'
  return `${formatDateShort(toISODate(d))} · ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
}
