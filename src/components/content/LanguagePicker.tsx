import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LANGUAGES } from '@/types'
import type { LanguageCode } from '@/types'

export function LanguagePicker({ value, onChange, className }: { value: LanguageCode; onChange: (v: LanguageCode) => void; className?: string }) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as LanguageCode)}>
      <SelectTrigger className={className}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {LANGUAGES.map((l) => (
          <SelectItem key={l.code} value={l.code}>
            {l.label} <span className="text-ink-400">· {l.nativeLabel}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
