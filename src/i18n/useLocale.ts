/**
 * Composable exposing the active locale, the list of available locales, and a
 * setter that switches the application's locale.
 */

import { computed, type ComputedRef } from 'vue'
import i18n, { setLocale as activateLocale } from '@/i18n'
import { isSupportedLocale, localeOptions, type LocaleOption } from '@/i18n/locales'

interface UseLocale {
  /** The currently active locale code. */
  current: ComputedRef<string>
  /** All locales the user can switch to. */
  available: readonly LocaleOption[]
  /**
   * Switches to `code`, lazy-loading its catalog, persisting it as the user's
   * preference, and updating document metadata. Unsupported codes are ignored.
   */
  setLocale: (code: string) => Promise<void>
}

/** @see UseLocale */
export function useLocale(): UseLocale {
  const current = computed(() => i18n.global.locale.value)

  async function setLocale(code: string) {
    if (!isSupportedLocale(code) || code === current.value) return
    await activateLocale(code)
  }

  return { current, available: localeOptions(), setLocale }
}
