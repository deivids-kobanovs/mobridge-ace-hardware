import { ArrowDown, ArrowUp, BookOpen, CheckCircle2, Menu, Pencil, Plus, Send, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { AckEmployeeButton } from '@/components/content/AckEmployeeButton'
import { AckManagerPanel } from '@/components/content/AckManagerPanel'
import { AckStatsBar } from '@/components/content/AckStatsBar'
import { RichTextViewer } from '@/components/content/RichTextViewer'
import { TranslationNotice } from '@/components/content/TranslationNotice'
import { HandbookSectionEditorModal } from '@/components/handbook/HandbookSectionEditorModal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDateMedium } from '@/lib/date'
import { handbookAckStats } from '@/lib/policy-helpers'
import { resolveTranslation } from '@/lib/translate'
import { cn } from '@/lib/utils'
import { useApp } from '@/store/AppContext'

export function HandbookPage() {
  const app = useApp()
  const { role, currentEmployeeId, handbook, handbookAcknowledgements, handbookSectionAcknowledgements, translations, getEmployeeLanguage } = app
  const isManager = role === 'manager'
  const sections = useMemo(() => [...handbook.sections].filter((s) => isManager || s.status === 'Published').sort((a, b) => a.sortOrder - b.sortOrder), [handbook.sections, isManager])

  const [activeId, setActiveId] = useState(sections[0]?.id ?? null)
  const [mobileTocOpen, setMobileTocOpen] = useState(false)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [showOriginal, setShowOriginal] = useState(false)

  const active = sections.find((s) => s.id === activeId) ?? sections[0]
  const employeeLang = getEmployeeLanguage(currentEmployeeId)
  const overallStats = handbookAckStats(handbook.version, handbookAcknowledgements)
  const myHandbookAck = handbookAcknowledgements.find((a) => a.handbookVersion === handbook.version && a.employeeId === currentEmployeeId)

  const translated = active
    ? resolveTranslation({
        cache: translations,
        type: 'handbook_section',
        id: active.id,
        version: active.version,
        sourceLanguage: handbook.originalLanguage,
        sourceTitle: active.title,
        sourceContent: active.content,
        targetLanguage: employeeLang,
      })
    : null

  function move(id: string, dir: -1 | 1) {
    const ids = sections.map((s) => s.id)
    const idx = ids.indexOf(id)
    const swapWith = idx + dir
    if (swapWith < 0 || swapWith >= ids.length) return
    ;[ids[idx], ids[swapWith]] = [ids[swapWith], ids[idx]]
    app.reorderHandbookSections(ids)
  }

  if (!active || !translated) {
    return (
      <div className="space-y-4">
        <h1 className="text-lg font-bold text-ink-900">Employee Handbook</h1>
        <p className="text-sm text-ink-400">No sections yet.</p>
        {isManager && (
          <Button onClick={() => app.addHandbookSection('New Section')}>
            <Plus className="size-4" /> Add Section
          </Button>
        )}
      </div>
    )
  }

  const editingSectionData = handbook.sections.find((s) => s.id === editingSection) ?? null
  const sectionAckStats = (sectionId: string, version: number) => {
    const acked = handbookSectionAcknowledgements.filter((a) => a.sectionId === sectionId && a.sectionVersion === version)
    return acked
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-lg font-bold text-ink-900">
            <BookOpen className="size-5 text-brand-600" />
            Employee Handbook
          </h1>
          <p className="text-sm text-ink-500">Last updated: {formatDateMedium(handbook.updatedAt.slice(0, 10))} · v{handbook.version}</p>
        </div>
        <button
          onClick={() => setMobileTocOpen((v) => !v)}
          className="flex items-center gap-1.5 rounded-lg border border-ink-200 bg-white px-3 py-2 text-xs font-semibold text-ink-600 lg:hidden"
        >
          <Menu className="size-4" />
          Chapters
        </button>
      </div>

      {handbook.requiresFullAcknowledgement && (
        <div className="rounded-xl border border-ink-200 bg-white p-4">
          {isManager ? (
            <AckManagerPanel
              stats={overallStats}
              acknowledgedAt={(id) => handbookAcknowledgements.find((a) => a.handbookVersion === handbook.version && a.employeeId === id)?.acknowledgedAt}
              onRemind={(timing) => app.remindPendingHandbookAck(timing)}
            />
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <AckStatsBar stats={overallStats} label="of your team acknowledged" className="sm:max-w-xs" />
              <AckEmployeeButton
                language={employeeLang}
                variant="handbook"
                acknowledgedAt={myHandbookAck?.acknowledgedAt}
                onAcknowledge={() => app.acknowledgeHandbook()}
              />
            </div>
          )}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[15rem_1fr]">
        <aside className={cn('space-y-1 rounded-xl border border-ink-200 bg-white p-2', !mobileTocOpen && 'hidden lg:block')}>
          {sections.map((s, i) => (
            <button
              key={s.id}
              onClick={() => {
                setActiveId(s.id)
                setMobileTocOpen(false)
                setShowOriginal(false)
              }}
              className={cn(
                'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                active.id === s.id ? 'bg-brand-50 font-semibold text-brand-700' : 'text-ink-600 hover:bg-ink-50',
              )}
            >
              <span className="text-xs text-ink-400">{String(i + 1).padStart(2, '0')}</span>
              <span className="flex-1 truncate">{s.title}</span>
              {s.status === 'Draft' && <Badge variant="outline">Draft</Badge>}
            </button>
          ))}
          {isManager && (
            <button
              onClick={() => app.addHandbookSection('New Section')}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-ink-400 hover:bg-ink-50 hover:text-ink-700"
            >
              <Plus className="size-4" />
              Add section
            </button>
          )}
        </aside>

        <div className="rounded-xl border border-ink-200 bg-white p-6 sm:p-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl font-bold text-ink-900">{showOriginal ? active.title : (translated.title ?? active.title)}</h2>
            {isManager && (
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => move(active.id, -1)} aria-label="Move up">
                  <ArrowUp className="size-3.5" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => move(active.id, 1)} aria-label="Move down">
                  <ArrowDown className="size-3.5" />
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setEditingSection(active.id)}>
                  <Pencil className="size-3.5" />
                  Edit
                </Button>
                {(active.draftTitle || active.draftContent) && (
                  <Button size="sm" onClick={() => app.publishHandbookSection(active.id)}>
                    <Send className="size-3.5" />
                    Publish
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => app.deleteHandbookSection(active.id)} aria-label="Delete section">
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            )}
          </div>

          <TranslationNotice
            sourceLanguage={handbook.originalLanguage}
            targetLanguage={employeeLang}
            isTranslated={translated.isTranslated}
            isAvailable={translated.isAvailable}
            showingOriginal={showOriginal}
            onToggle={() => setShowOriginal((v) => !v)}
          />

          <RichTextViewer content={showOriginal ? active.content : translated.content} className="mt-4" />

          {active.requiresAcknowledgement && (
            <div className="mt-8 border-t border-ink-100 pt-6">
              {isManager ? (
                <p className="flex items-center gap-2 text-sm text-ink-500">
                  <CheckCircle2 className="size-4" />
                  {sectionAckStats(active.id, active.version).length} employee(s) have acknowledged this chapter.
                </p>
              ) : (
                <AckEmployeeButton
                  language={employeeLang}
                  acknowledgedAt={sectionAckStats(active.id, active.version).find((a) => a.employeeId === currentEmployeeId)?.acknowledgedAt}
                  onAcknowledge={() => app.acknowledgeHandbookSection(active.id)}
                />
              )}
            </div>
          )}
        </div>
      </div>

      <HandbookSectionEditorModal open={!!editingSection} onOpenChange={(v) => !v && setEditingSection(null)} section={editingSectionData} />
    </div>
  )
}
