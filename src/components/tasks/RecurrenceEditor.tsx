import { Info } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { todayISO } from '@/lib/date'
import { recurrenceSummary } from '@/lib/task-helpers'
import { cn } from '@/lib/utils'
import type { RecurrenceConfig, RecurrenceFrequency } from '@/types'

const FREQUENCIES: RecurrenceFrequency[] = ['Daily', 'Weekdays', 'Weekly', 'Every 2 Weeks', 'Monthly', 'Quarterly', 'Yearly', 'Custom']
const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export function RecurrenceEditor({ value, onChange }: { value: RecurrenceConfig; onChange: (r: RecurrenceConfig) => void }) {
  const showDaysOfWeek = ['Weekly', 'Every 2 Weeks'].includes(value.frequency) || (value.frequency === 'Custom' && value.intervalUnit === 'weeks')
  const showDayOfMonth = value.frequency === 'Monthly' || (value.frequency === 'Custom' && value.intervalUnit === 'months')

  function toggleDay(d: number) {
    const days = value.daysOfWeek ?? []
    onChange({ ...value, daysOfWeek: days.includes(d) ? days.filter((x) => x !== d) : [...days, d].sort() })
  }

  return (
    <div className="space-y-4 rounded-lg border border-ink-200 bg-ink-50 p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-ink-600">Frequency</label>
          <Select value={value.frequency} onValueChange={(f: RecurrenceFrequency) => onChange({ ...value, frequency: f })}>
            <SelectTrigger className="bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FREQUENCIES.map((f) => (
                <SelectItem key={f} value={f}>
                  {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-ink-600">Starting</label>
          <Input type="date" value={value.startDate} min={todayISO()} onChange={(e) => onChange({ ...value, startDate: e.target.value })} className="bg-white" />
        </div>
      </div>

      {value.frequency === 'Custom' && (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-ink-600">Repeat every</span>
            <Input
              type="number"
              min={1}
              value={value.interval ?? 1}
              onChange={(e) => onChange({ ...value, interval: Number(e.target.value) || 1 })}
              className="w-20 bg-white"
            />
            <Select value={value.intervalUnit ?? 'weeks'} onValueChange={(u) => onChange({ ...value, intervalUnit: u as RecurrenceConfig['intervalUnit'] })}>
              <SelectTrigger className="bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="days">Days</SelectItem>
                <SelectItem value="weeks">Weeks</SelectItem>
                <SelectItem value="months">Months</SelectItem>
                <SelectItem value="years">Years</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {showDaysOfWeek && (
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-ink-600">Repeat on</label>
          <div className="flex gap-1.5">
            {DAY_LABELS.map((label, i) => (
              <button
                key={i}
                type="button"
                onClick={() => toggleDay(i)}
                className={cn(
                  'flex size-9 items-center justify-center rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                  value.daysOfWeek?.includes(i) ? 'bg-brand-600 text-white' : 'bg-white text-ink-500 border border-ink-200 hover:bg-ink-100',
                )}
                aria-pressed={value.daysOfWeek?.includes(i)}
                aria-label={['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][i]}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {showDayOfMonth && (
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-ink-600">Day of month</label>
          <Input
            type="number"
            min={1}
            max={31}
            value={value.dayOfMonth ?? 1}
            onChange={(e) => onChange({ ...value, dayOfMonth: Number(e.target.value) || 1 })}
            className="w-24 bg-white"
          />
        </div>
      )}

      <div className="space-y-2">
        <label className="text-xs font-semibold text-ink-600">Ends</label>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm text-ink-700">
            <input type="radio" name="recur-end" checked={value.endType === 'never'} onChange={() => onChange({ ...value, endType: 'never' })} className="accent-brand-600" />
            Continue indefinitely
          </label>
          <label className="flex items-center gap-2 text-sm text-ink-700">
            <input type="radio" name="recur-end" checked={value.endType === 'onDate'} onChange={() => onChange({ ...value, endType: 'onDate' })} className="accent-brand-600" />
            On date
            {value.endType === 'onDate' && (
              <Input
                type="date"
                value={value.endDate ?? value.startDate}
                min={value.startDate}
                onChange={(e) => onChange({ ...value, endDate: e.target.value })}
                className="ml-1 w-auto bg-white"
              />
            )}
          </label>
          <label className="flex items-center gap-2 text-sm text-ink-700">
            <input
              type="radio"
              name="recur-end"
              checked={value.endType === 'afterOccurrences'}
              onChange={() => onChange({ ...value, endType: 'afterOccurrences' })}
              className="accent-brand-600"
            />
            After
            {value.endType === 'afterOccurrences' && (
              <Input
                type="number"
                min={1}
                value={value.occurrences ?? 10}
                onChange={(e) => onChange({ ...value, occurrences: Number(e.target.value) || 1 })}
                className="ml-1 w-20 bg-white"
              />
            )}
            occurrences
          </label>
        </div>
      </div>

      <p className="flex items-start gap-1.5 rounded-md bg-brand-50 px-3 py-2 text-sm text-brand-800">
        <Info className="mt-0.5 size-4 shrink-0" />
        {recurrenceSummary({ recurrence: value })}
      </p>
    </div>
  )
}
