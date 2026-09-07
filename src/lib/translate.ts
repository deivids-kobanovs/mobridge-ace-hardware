import { LANGUAGES } from '@/types'
import type { LanguageCode, TranslationEntry, TranslationSourceType } from '@/types'

export function languageLabel(code?: LanguageCode): string {
  if (!code) return 'Unknown'
  return LANGUAGES.find((l) => l.code === code)?.label ?? code.toUpperCase()
}

export function languageNativeLabel(code?: LanguageCode): string {
  if (!code) return 'Unknown'
  return LANGUAGES.find((l) => l.code === code)?.nativeLabel ?? code.toUpperCase()
}

export function cacheKey(type: TranslationSourceType, id: string, version: number, target: LanguageCode): string {
  return `${type}:${id}:v${version}:${target}`
}

export interface ResolvedTranslation {
  title?: string
  content: string
  isTranslated: boolean
  isAvailable: boolean
  sourceLanguage: LanguageCode
  targetLanguage: LanguageCode
}

/**
 * Resolves display content for a given piece of source content in an employee's
 * preferred language. Mirrors how a real backend would check a translation cache
 * (keyed by content id + version + source + target language) before ever calling
 * an AI translation provider — here the "cache" is simply pre-seeded demo data.
 */
export function resolveTranslation(opts: {
  cache: TranslationEntry[]
  type: TranslationSourceType
  id: string
  version: number
  sourceLanguage: LanguageCode
  sourceTitle?: string
  sourceContent: string
  targetLanguage: LanguageCode
}): ResolvedTranslation {
  const { cache, type, id, version, sourceLanguage, sourceTitle, sourceContent, targetLanguage } = opts

  if (targetLanguage === sourceLanguage) {
    return { title: sourceTitle, content: sourceContent, isTranslated: false, isAvailable: true, sourceLanguage, targetLanguage }
  }

  const hit = cache.find(
    (t) => t.sourceType === type && t.sourceId === id && t.sourceVersion === version && t.sourceLanguage === sourceLanguage && t.targetLanguage === targetLanguage,
  )

  if (hit) {
    return { title: hit.translatedTitle ?? sourceTitle, content: hit.translatedContent, isTranslated: true, isAvailable: true, sourceLanguage, targetLanguage }
  }

  return { title: sourceTitle, content: sourceContent, isTranslated: false, isAvailable: false, sourceLanguage, targetLanguage }
}
