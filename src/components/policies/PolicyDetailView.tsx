import { ArrowLeft, Clock, Eye, History, Pencil, Send, ShieldOff } from 'lucide-react'
import { useMemo, useState } from 'react'
import { AckEmployeeButton } from '@/components/content/AckEmployeeButton'
import { AckManagerPanel } from '@/components/content/AckManagerPanel'
import { LanguagePicker } from '@/components/content/LanguagePicker'
import { RichTextViewer } from '@/components/content/RichTextViewer'
import { TranslationNotice } from '@/components/content/TranslationNotice'
import { PolicyEditorModal } from '@/components/policies/PolicyEditorModal'
import { PublishPolicyDialog } from '@/components/policies/PublishPolicyDialog'
import { VersionHistoryModal } from '@/components/policies/VersionHistoryModal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDateMedium } from '@/lib/date'
import { policyAckStats } from '@/lib/policy-helpers'
import { resolveTranslation } from '@/lib/translate'
import { useApp } from '@/store/AppContext'
import type { LanguageCode } from '@/types'

export function PolicyDetailView({ policyId, onBack }: { policyId: string; onBack: () => void }) {
  const app = useApp()
  const { role, currentEmployeeId, policies, policyCategories, policyAcknowledgements, translations, getEmployeeLanguage } = app
  const policy = policies.find((p) => p.id === policyId)

  const [editOpen, setEditOpen] = useState(false)
  const [publishOpen, setPublishOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [showOriginal, setShowOriginal] = useState(false)
  const [previewLang, setPreviewLang] = useState<LanguageCode | null>(null)

  const category = policyCategories.find((c) => c.id === policy?.categoryId)
  const isManager = role === 'manager'
  const employeeLang = isManager ? (previewLang ?? policy?.originalLanguage ?? 'en') : getEmployeeLanguage(currentEmployeeId)

  const translated = useMemo(() => {
    if (!policy) return null
    return resolveTranslation({
      cache: translations,
      type: 'policy',
      id: policy.id,
      version: policy.version,
      sourceLanguage: policy.originalLanguage,
      sourceTitle: policy.title,
      sourceContent: policy.content,
      targetLanguage: employeeLang,
    })
  }, [policy, translations, employeeLang])

  if (!policy || !translated) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="size-4" />
          Back to Policies
        </Button>
        <p className="text-sm text-ink-400">This policy could not be found.</p>
      </div>
    )
  }

  const displayTitle = showOriginal ? policy.title : (translated.title ?? policy.title)
  const displayContent = showOriginal ? policy.content : translated.content
  const stats = policyAckStats(policy, policyAcknowledgements)
  const myAck = policyAcknowledgements.find((a) => a.policyId === policy.id && a.policyVersion === policy.version && a.employeeId === currentEmployeeId)
  const isDraftOnly = policy.status === 'Draft' && policy.versions.length === 0
  const hasPendingDraftEdits = !!(policy.draftTitle || policy.draftContent || policy.draftDescription)

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={onBack}>
        <ArrowLeft className="size-4" />
        Back to Policies
      </Button>

      <div className="rounded-2xl border border-ink-200 bg-white p-6 sm:p-8">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {category && <Badge variant="neutral">{category.name}</Badge>}
          <Badge variant={policy.status === 'Published' ? 'success' : 'outline'}>{policy.status}</Badge>
          {policy.status === 'Published' && <Badge variant="info">v{policy.version}</Badge>}
          {isManager && hasPendingDraftEdits && <Badge variant="warning">Unpublished draft changes</Badge>}
        </div>

        <h1 className="text-2xl font-bold text-ink-900">{displayTitle}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-500">
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" /> Updated {formatDateMedium(policy.updatedAt.slice(0, 10))} by {policy.updatedBy}
          </span>
        </div>

        {isManager && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-y border-ink-100 py-3">
            <Button size="sm" variant="secondary" onClick={() => setEditOpen(true)}>
              <Pencil className="size-3.5" />
              {isDraftOnly ? 'Edit Draft' : 'Edit'}
            </Button>
            <Button size="sm" onClick={() => setPublishOpen(true)}>
              <Send className="size-3.5" />
              {isDraftOnly ? 'Publish Policy' : 'Publish Update'}
            </Button>
            {policy.versions.length > 0 && (
              <Button size="sm" variant="ghost" onClick={() => setHistoryOpen(true)}>
                <History className="size-3.5" />
                Version History
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="ml-auto"
              onClick={() => app.archivePolicy(policy.id, !policy.archived)}
            >
              <ShieldOff className="size-3.5" />
              {policy.archived ? 'Restore' : 'Archive'}
            </Button>
          </div>
        )}

        {isManager && policy.status === 'Published' && (
          <div className="mt-4 flex items-center gap-2 text-xs text-ink-500">
            <Eye className="size-3.5" />
            Preview as:
            <LanguagePicker value={previewLang ?? policy.originalLanguage} onChange={setPreviewLang} className="h-8 w-44 text-xs" />
          </div>
        )}

        <div className="mt-6">
          <TranslationNotice
            sourceLanguage={policy.originalLanguage}
            targetLanguage={employeeLang}
            isTranslated={translated.isTranslated}
            isAvailable={translated.isAvailable}
            aiFlag
            showingOriginal={showOriginal}
            onToggle={() => setShowOriginal((v) => !v)}
          />
        </div>

        <RichTextViewer content={displayContent} className="mt-4" />

        {policy.requiresAcknowledgement && policy.status === 'Published' && (
          <div className="mt-8 border-t border-ink-100 pt-6">
            {isManager ? (
              <AckManagerPanel
                stats={stats}
                acknowledgedAt={(id) => policyAcknowledgements.find((a) => a.policyId === policy.id && a.policyVersion === policy.version && a.employeeId === id)?.acknowledgedAt}
                onRemind={(timing) => app.remindPendingPolicyEmployees(policy.id, timing)}
              />
            ) : (
              <AckEmployeeButton
                language={employeeLang}
                variant={policy.versions.length > 1 ? 'policy_update' : 'policy'}
                acknowledgedAt={myAck?.acknowledgedAt}
                onAcknowledge={() => app.acknowledgePolicy(policy.id)}
              />
            )}
          </div>
        )}
      </div>

      <PolicyEditorModal open={editOpen} onOpenChange={setEditOpen} policy={policy} />
      <PublishPolicyDialog open={publishOpen} onOpenChange={setPublishOpen} policy={policy} onPublish={(opts) => app.publishPolicy(policy.id, opts)} />
      <VersionHistoryModal policy={historyOpen ? policy : null} onOpenChange={(v) => !v && setHistoryOpen(false)} />
    </div>
  )
}
