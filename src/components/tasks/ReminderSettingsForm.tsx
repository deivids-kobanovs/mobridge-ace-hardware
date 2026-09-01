import type { ReactNode } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/checkbox'
import { MANAGERS } from '@/data/employees'
import type { ReminderConfig } from '@/types'

const BEFORE_OPTIONS = [15, 30, 60, 240, 1440]
const REPEAT_OPTIONS = [30, 60, 120, 240]
const ESCALATE_OPTIONS = [60, 120, 240, 480]

function label(mins: number) {
  if (mins < 60) return `${mins} minutes`
  if (mins === 1440) return '1 day'
  const h = mins / 60
  return `${h} hour${h > 1 ? 's' : ''}`
}

export function ReminderSettingsForm({ value, onChange }: { value: ReminderConfig; onChange: (r: ReminderConfig) => void }) {
  return (
    <div className="space-y-4 rounded-lg border border-ink-200 p-4">
      <Row
        title="Remind assigned employee before due time"
        checked={value.remindBeforeDue}
        onCheckedChange={(v) => onChange({ ...value, remindBeforeDue: v })}
      >
        {value.remindBeforeDue && (
          <Select value={String(value.remindMinutesBefore)} onValueChange={(v) => onChange({ ...value, remindMinutesBefore: Number(v) })}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BEFORE_OPTIONS.map((m) => (
                <SelectItem key={m} value={String(m)}>
                  {label(m)} before
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </Row>

      <Row title="Notify employee when task becomes overdue" checked={value.notifyOverdue} onCheckedChange={(v) => onChange({ ...value, notifyOverdue: v })} />

      <Row title="Notify manager when task becomes overdue" checked={value.notifyManagerOnOverdue} onCheckedChange={(v) => onChange({ ...value, notifyManagerOnOverdue: v })}>
        {value.notifyManagerOnOverdue && (
          <Select
            value={String(value.repeatOverdueEvery ?? 0)}
            onValueChange={(v) => onChange({ ...value, repeatOverdueEvery: Number(v) || undefined })}
          >
            <SelectTrigger className="w-56">
              <SelectValue placeholder="No repeat" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Don&apos;t repeat</SelectItem>
              {REPEAT_OPTIONS.map((m) => (
                <SelectItem key={m} value={String(m)}>
                  Repeat every {label(m)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </Row>

      <Row
        title="Escalate to another manager if still overdue"
        checked={!!value.escalateAfterMinutes}
        onCheckedChange={(v) => onChange({ ...value, escalateAfterMinutes: v ? 120 : undefined, escalateToManagerId: v ? (value.escalateToManagerId ?? MANAGERS[0].id) : undefined })}
      >
        {!!value.escalateAfterMinutes && (
          <div className="flex flex-wrap gap-2">
            <Select value={String(value.escalateAfterMinutes)} onValueChange={(v) => onChange({ ...value, escalateAfterMinutes: Number(v) })}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ESCALATE_OPTIONS.map((m) => (
                  <SelectItem key={m} value={String(m)}>
                    after {label(m)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={value.escalateToManagerId ?? MANAGERS[0].id} onValueChange={(v) => onChange({ ...value, escalateToManagerId: v })}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MANAGERS.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    to {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </Row>
    </div>
  )
}

function Row({
  title,
  checked,
  onCheckedChange,
  children,
}: {
  title: string
  checked: boolean
  onCheckedChange: (v: boolean) => void
  children?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-2 border-b border-ink-100 pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <label className="flex items-center gap-3 text-sm font-medium text-ink-800">
        <Switch checked={checked} onCheckedChange={onCheckedChange} />
        {title}
      </label>
      {children}
    </div>
  )
}
