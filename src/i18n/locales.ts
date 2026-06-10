/**
 * Registry of locales the application supports, plus helpers for resolving the
 * locale to activate on startup and labelling the locale switcher.
 */

/** Every locale the application ships translations for. */
export const SUPPORTED_LOCALES = ['en', 'zh-CN', 'ja-JP'] as const

/** A locale supported by the application. */
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

/** The locale used when no better match is found and as the fallback chain root. */
export const DEFAULT_LOCALE: SupportedLocale = 'en'

/** `localStorage` key under which the user's chosen locale is stored. */
export const LOCALE_STORAGE_KEY = 'locale'

/** Type guard narrowing an arbitrary string to a supported locale. */
export function isSupportedLocale(value: string): value is SupportedLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value)
}

/**
 * Maps a single BCP-47 language tag to a supported locale, matching first on
 * the exact tag (case-insensitively) and then on the primary language subtag
 * (`zh-Hans` → `zh-CN`, `ja-JP-x-anything` → `ja-JP`).
 *
 * @param tag A language tag such as `zh`, `zh-Hans`, or `ja-JP`.
 * @returns The matching supported locale, or `null` if none matches.
 */
export function matchLocale(tag: string): SupportedLocale | null {
  const lower = tag.toLowerCase()

  const exact = SUPPORTED_LOCALES.find((locale) => locale.toLowerCase() === lower)
  if (exact) return exact

  const primary = lower.split('-')[0]
  const byPrimary = SUPPORTED_LOCALES.find(
    (locale) => locale.toLowerCase().split('-')[0] === primary,
  )
  return byPrimary ?? null
}

function readStoredLocale(): SupportedLocale | null {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
    return stored !== null && isSupportedLocale(stored) ? stored : null
  } catch {
    return null
  }
}

/**
 * Determines the locale to activate on startup: the user's stored choice if
 * any, otherwise the first of the browser's preferred languages that maps to a
 * supported locale, otherwise {@link DEFAULT_LOCALE}.
 */
export function detectLocale(): SupportedLocale {
  const stored = readStoredLocale()
  if (stored) return stored

  const preferred = navigator.languages.length > 0 ? navigator.languages : [navigator.language]
  for (const tag of preferred) {
    const match = tag ? matchLocale(tag) : null
    if (match) return match
  }

  return DEFAULT_LOCALE
}

// Intl's autonym for zh-CN is the bare 中文; the site supports Simplified
// Chinese specifically, so the label says so. Japanese has no sibling locale
// here, so the region qualifier Intl appends is dropped.
const LABEL_OVERRIDES: Partial<Record<SupportedLocale, string>> = {
  'zh-CN': '中文（简体）',
  'ja-JP': '日本語',
}

function autonym(locale: SupportedLocale): string {
  const name = new Intl.DisplayNames([locale], {
    type: 'language',
    languageDisplay: 'standard',
  }).of(locale)
  if (!name) return locale
  return name.charAt(0).toLocaleUpperCase(locale) + name.slice(1)
}

/** A selectable entry in the locale switcher menu. */
export interface LocaleOption {
  /** The locale code to activate. */
  value: SupportedLocale
  /** The locale's name written in that locale, for display. */
  label: string
}

/**
 * The selectable options for the locale switcher menu, each labelled with its
 * own autonym (e.g. `日本語`).
 */
export function localeOptions(): LocaleOption[] {
  return SUPPORTED_LOCALES.map((locale) => ({
    value: locale,
    label: LABEL_OVERRIDES[locale] ?? autonym(locale),
  }))
}
