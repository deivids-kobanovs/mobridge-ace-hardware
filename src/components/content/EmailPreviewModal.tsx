import { Dialog, Modal } from '@/components/ui/dialog'
import { languageLabel } from '@/lib/translate'
import type { SimulatedEmail } from '@/types'

export function EmailPreviewModal({ email, onOpenChange }: { email: SimulatedEmail | null; onOpenChange: (v: boolean) => void }) {
  return (
    <Dialog open={!!email} onOpenChange={onOpenChange}>
      {email && (
        <Modal title="Email Preview" description={`To ${email.to} · ${languageLabel(email.language)}`} size="md">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-ink-900">{email.subject}</p>
            <div className="rounded-lg border border-ink-200 bg-ink-50 p-4 text-sm text-ink-700" dangerouslySetInnerHTML={{ __html: email.bodyHtml }} />
            <p className="text-xs text-ink-400">
              Simulated email — this preview shows what would be sent by a real email provider. No message was actually delivered.
            </p>
          </div>
        </Modal>
      )}
    </Dialog>
  )
}
