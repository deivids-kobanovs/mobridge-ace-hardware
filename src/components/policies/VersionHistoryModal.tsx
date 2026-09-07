import { Dialog, Modal } from '@/components/ui/dialog'
import { RichTextViewer } from '@/components/content/RichTextViewer'
import { formatDateMedium } from '@/lib/date'
import type { Policy } from '@/types'

export function VersionHistoryModal({ policy, onOpenChange }: { policy: Policy | null; onOpenChange: (v: boolean) => void }) {
  return (
    <Dialog open={!!policy} onOpenChange={onOpenChange}>
      {policy && (
        <Modal title="Version History" description={policy.title} size="lg">
          <div className="space-y-6">
            {[...policy.versions].reverse().map((v) => (
              <div key={v.version} className="rounded-xl border border-ink-200 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-semibold text-ink-900">
                    Version {v.version} — {formatDateMedium(v.publishedAt.slice(0, 10))}
                  </p>
                  <p className="text-xs text-ink-400">by {v.publishedBy}</p>
                </div>
                {v.summaryOfChanges && <p className="mb-2 rounded-lg bg-sky-50 px-3 py-2 text-xs text-sky-800">{v.summaryOfChanges}</p>}
                <RichTextViewer content={v.content} className="max-h-64 overflow-y-auto rounded-lg bg-ink-50 p-3" />
              </div>
            ))}
            {policy.versions.length === 0 && <p className="text-sm text-ink-400">No published versions yet.</p>}
          </div>
        </Modal>
      )}
    </Dialog>
  )
}
