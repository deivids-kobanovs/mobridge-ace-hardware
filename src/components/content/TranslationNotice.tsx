import { Languages } from 'lucide-react'
import { t } from '@/lib/i18nStrings'
import { languageLabel } from '@/lib/translate'
import type { LanguageCode } from '@/types'

export function TranslationNotice({
  sourceLanguage,
  targetLanguage,
  isTranslated,
  isAvailable,
  aiFlag,
  showingOriginal,
  onToggle,
}: {
  sourceLanguage: LanguageCode
  targetLanguage: LanguageCode
  isTranslated: boolean
  isAvailable: boolean
  aiFlag?: boolean
  showingOriginal: boolean
  onToggle: () => void
}) {
  if (sourceLanguage === targetLanguage) return null

  if (!isAvailable) {
    return (
      <p className="flex items-start gap-2 rounded-lg bg-ink-100 px-3 py-2 text-xs text-ink-500">
        <Languages className="mt-0.5 size-3.5 shrink-0" />
        {t('translation_pending', targetLanguage)}
      </p>
    )
  }

  if (!isTranslated) return null

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg bg-sky-50 px-3 py-2 text-xs font-medium text-sky-800">
      <Languages className="size-3.5 shrink-0" />
      <span>
        {t(aiFlag ? 'ai_translation_from' : 'translated_from', targetLanguage)} {languageLabel(sourceLanguage)}
      </span>
      <button onClick={onToggle} className="ml-auto font-semibold text-sky-700 underline underline-offset-2 hover:text-sky-900">
        {showingOriginal ? t('hide_original', targetLanguage) : t('view_original', targetLanguage)}
      </button>
    </div>
  )
}
