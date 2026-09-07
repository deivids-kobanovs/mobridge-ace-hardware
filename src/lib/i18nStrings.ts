import type { LanguageCode } from '@/types'

// Small phrasebook for UI-level strings that need to appear in an employee's
// preferred language even when the underlying content translation cache
// doesn't have a full AI translation cached yet (e.g. notification titles,
// acknowledgement actions). Falls back to English for any language/key not
// covered here — this is intentionally a small showcase set, not a full i18n
// framework.
const STRINGS: Record<string, Partial<Record<LanguageCode, string>>> = {
  due_soon: { es: 'Vence pronto', no: 'Forfaller snart', pl: 'Termin się zbliża' },
  now_overdue: { es: 'Ahora vencida', no: 'Nå forfalt', pl: 'Zaległe' },
  new_task_assigned: { es: 'Nueva tarea asignada', no: 'Ny oppgave tildelt', pl: 'Przypisano nowe zadanie' },
  policy_updated: { es: 'Política actualizada', no: 'Retningslinje oppdatert', pl: 'Zaktualizowano zasady' },
  new_policy_published: { es: 'Nueva política publicada', no: 'Ny retningslinje publisert', pl: 'Opublikowano nowe zasady' },
  handbook_updated: { es: 'Manual actualizado', no: 'Personalhåndbok oppdatert', pl: 'Zaktualizowano podręcznik' },
  translated_from: { es: 'Traducido de', no: 'Oversatt fra', pl: 'Przetłumaczono z' },
  ai_translation_from: { es: 'Traducción por IA desde', no: 'KI-oversettelse fra', pl: 'Tłumaczenie AI z' },
  view_original: { es: 'Ver original', no: 'Vis original', pl: 'Zobacz oryginał' },
  hide_original: { es: 'Ocultar original', no: 'Skjul original', pl: 'Ukryj oryginał' },
  translation_pending: {
    es: 'Traducción con IA aún no disponible en esta vista previa — mostrando el texto original.',
    no: 'KI-oversettelse er ikke tilgjengelig ennå i denne forhåndsvisningen — viser originalteksten.',
    pl: 'Tłumaczenie AI nie jest jeszcze dostępne w tym podglądzie — wyświetlono tekst oryginalny.',
  },
  i_have_read_policy: {
    es: 'He leído y entendido esta política',
    no: 'Jeg har lest og forstått denne retningslinjen',
    pl: 'Przeczytałem/am i zrozumiałem/am te zasady',
  },
  i_have_read_update: {
    es: 'He leído y entendido esta actualización',
    no: 'Jeg har lest og forstått denne oppdateringen',
    pl: 'Przeczytałem/am i zrozumiałem/am tę aktualizację',
  },
  i_have_read_handbook: {
    es: 'He leído y entendido el Manual del Empleado',
    no: 'Jeg har lest og forstått personalhåndboken',
    pl: 'Przeczytałem/am i zrozumiałem/am podręcznik pracownika',
  },
  acknowledged: { es: 'Confirmado', no: 'Bekreftet', pl: 'Potwierdzone' },
  required_reading: { es: 'Lectura obligatoria', no: 'Obligatorisk lesing', pl: 'Wymagana lektura' },
  up_to_date: { es: 'Estás al día', no: 'Du er oppdatert', pl: 'Wszystko na bieżąco' },
}

export function t(key: keyof typeof STRINGS, lang: LanguageCode): string {
  const entry = STRINGS[key]
  const fallback = key.toString().replace(/_/g, ' ')
  if (!entry) return fallback
  return entry[lang] ?? entry.en ?? fallback
}
