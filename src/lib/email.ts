import { COMPANY_NAME } from '@/data/employees'
import { formatDateMedium } from '@/lib/date'
import { resolveTranslation } from '@/lib/translate'
import type { Employee, Policy, TranslationEntry } from '@/types'

const SUBJECT_LABEL: Record<string, string> = {
  es: 'Política actualizada',
  no: 'Oppdatert retningslinje',
  pl: 'Zaktualizowane zasady',
}
const GREETING: Record<string, string> = { es: 'Hola', no: 'Hei', pl: 'Cześć' }
const WHATS_CHANGED: Record<string, string> = { es: 'Qué cambió', no: 'Hva er endret', pl: 'Co się zmieniło' }
const VERSION_LABEL: Record<string, string> = { es: 'Versión', no: 'Versjon', pl: 'Wersja' }
const UPDATED_LABEL: Record<string, string> = { es: 'Actualizado', no: 'Oppdatert', pl: 'Zaktualizowano' }
const VIEW_BUTTON: Record<string, string> = { es: 'Ver Política Actualizada', no: 'Vis Oppdatert Retningslinje', pl: 'Zobacz Zaktualizowane Zasady' }
const CLOSING_LINE: Record<string, string> = {
  es: 'Por favor revisa el procedimiento actualizado y confirma que lo has leído y entendido.',
  no: 'Vennligst gå gjennom den oppdaterte rutinen og bekreft at du har lest og forstått den.',
  pl: 'Prosimy o zapoznanie się ze zaktualizowaną procedurą i potwierdzenie, że została przeczytana i zrozumiana.',
}

function pick(map: Record<string, string>, lang: string, fallback: string): string {
  return map[lang] ?? fallback
}

export function composePolicyUpdateEmail(policy: Policy, employee: Employee, cache: TranslationEntry[]): { subject: string; bodyHtml: string } {
  const lang = employee.preferredLanguage
  const latestVersion = policy.versions[policy.versions.length - 1]
  const titleT = resolveTranslation({
    cache,
    type: 'policy',
    id: policy.id,
    version: policy.version,
    sourceLanguage: policy.originalLanguage,
    sourceTitle: policy.title,
    sourceContent: policy.content,
    targetLanguage: lang,
  })
  const summaryT = latestVersion?.summaryOfChanges
    ? resolveTranslation({
        cache,
        type: 'policy_summary',
        id: policy.id,
        version: policy.version,
        sourceLanguage: policy.originalLanguage,
        sourceContent: latestVersion.summaryOfChanges,
        targetLanguage: lang,
      })
    : null

  const subjectLabel = pick(SUBJECT_LABEL, lang, 'Updated Policy')
  const greeting = pick(GREETING, lang, 'Hi')
  const whatsChanged = pick(WHATS_CHANGED, lang, "What's changed")
  const versionLabel = pick(VERSION_LABEL, lang, 'Version')
  const updatedLabel = pick(UPDATED_LABEL, lang, 'Updated')
  const viewButton = pick(VIEW_BUTTON, lang, 'View Updated Policy')
  const closingLine = pick(
    CLOSING_LINE,
    lang,
    'Please review the updated procedure and acknowledge that you have read and understood it.',
  )

  const firstName = employee.name.split(' ')[0]
  const subject = `${subjectLabel}: ${titleT.title ?? policy.title}`
  const bodyHtml = `
    <p>${greeting} ${firstName},</p>
    <p>${titleT.title ?? policy.title} ${lang === policy.originalLanguage ? 'has been updated.' : 'has been updated.'}</p>
    ${summaryT ? `<p><strong>${whatsChanged}</strong><br/>${summaryT.content}</p>` : ''}
    <p>${versionLabel}: ${policy.version}<br/>${updatedLabel}: ${formatDateMedium(policy.publishedAt?.slice(0, 10) ?? policy.updatedAt.slice(0, 10))}</p>
    <p><a href="#" style="display:inline-block;padding:10px 18px;background:#d9af5b;color:#1a1509;border-radius:8px;text-decoration:none;font-weight:600;">${viewButton}</a></p>
    <p>${closingLine}</p>
    <p>${COMPANY_NAME}<br/><span style="color:#7d818b;font-size:12px;">via Workgrid</span></p>
  `.trim()

  return { subject, bodyHtml }
}
