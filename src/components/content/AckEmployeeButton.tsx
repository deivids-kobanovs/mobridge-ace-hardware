import { CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { formatTimestamp } from '@/lib/date'
import { t } from '@/lib/i18nStrings'
import type { LanguageCode } from '@/types'

export function AckEmployeeButton({
  language,
  variant = 'policy',
  acknowledgedAt,
  onAcknowledge,
}: {
  language: LanguageCode
  variant?: 'policy' | 'policy_update' | 'handbook'
  acknowledgedAt?: string
  onAcknowledge: () => void
}) {
  const [confirming, setConfirming] = useState(false)

  if (acknowledgedAt) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
        <CheckCircle2 className="size-5 shrink-0" />
        <span>
          {t('acknowledged', language)} — {formatTimestamp(acknowledgedAt)}
        </span>
      </div>
    )
  }

  if (confirming) {
    return (
      <div className="space-y-3 rounded-xl border border-brand-200 bg-brand-50 p-4">
        <p className="text-sm text-brand-900">
          This confirms that you have received, read, and understood this information. It is not an electronic signature.
        </p>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setConfirming(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onAcknowledge()
              setConfirming(false)
            }}
          >
            Confirm
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Button className="w-full sm:w-auto" onClick={() => setConfirming(true)}>
      <CheckCircle2 className="size-4" />
      {t(variant === 'handbook' ? 'i_have_read_handbook' : variant === 'policy_update' ? 'i_have_read_update' : 'i_have_read_policy', language)}
    </Button>
  )
}
