import { createI18n } from 'vue-i18n'
import type { LocaleMessage } from '@intlify/core-base'

import en from '@/i18n/strings/en'
import numberFormats from '@/i18n/strings/numberFormats'
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  detectLocale,
  type SupportedLocale,
} from '@/i18n/locales'
import { applyLocaleMetadata } from '@/i18n/metadata'

/**
 * The base `en` catalog is bundled eagerly because it is always needed as the
 * fallback. Every other locale's messages are code-split and fetched on demand
 * by {@link setLocale}, so a first paint only ships the active locale's chunk
 * plus `en`. The tiny `numberFormats` config stays eager for all locales.
 */
const i18n = createI18n({
  locale: DEFAULT_LOCALE,
  fallbackLocale: DEFAULT_LOCALE,
  silentFallbackWarn: true,
  legacy: false,
  messages: { en },
  numberFormats,
})
export default i18n

type LazyLocale = Exclude<SupportedLocale, 'en'>
interface LocaleModule {
  default: LocaleMessage
}

// Explicit per-locale loaders (rather than a templated dynamic import) so the
// eagerly-bundled `en` catalog isn't also pulled into a dynamic chunk.
const loaders: Record<LazyLocale, () => Promise<LocaleModule>> = {
  'zh-CN': () => import('@/i18n/strings/zh-CN'),
  'ja-JP': () => import('@/i18n/strings/ja-JP'),
}

const loaded = new Set<SupportedLocale>([DEFAULT_LOCALE])

async function loadMessages(locale: SupportedLocale): Promise<void> {
  if (loaded.has(locale)) return
  const { default: messages } = await loaders[locale as LazyLocale]()
  i18n.global.setLocaleMessage(locale, messages)
  loaded.add(locale)
}

/**
 * Activates a locale across the whole app: lazy-loads its message catalog
 * before switching (so the UI never flashes the fallback language), switches
 * vue-i18n, persists the choice, and refreshes document metadata.
 */
export async function setLocale(locale: SupportedLocale): Promise<void> {
  await loadMessages(locale)
  i18n.global.locale.value = locale
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  } catch {
    // Storage may be unavailable (e.g. blocked); the choice just won't persist.
  }
  applyLocaleMetadata()
}

/** Resolves and applies the initial locale from storage / browser preferences. */
export function initLocale(): Promise<void> {
  return setLocale(detectLocale())
}
