/**
 * Keeps document-level metadata that lives outside the Vue tree — the document
 * language, title, meta description, and skip link — in sync with the active
 * locale.
 */

import i18n from '@/i18n'

function setMetaContent(name: string, content: string) {
  const tag = document.querySelector(`meta[name="${name}"]`)
  if (tag) tag.setAttribute('content', content)
}

/**
 * Applies the active locale to document metadata. Safe to call repeatedly;
 * intended to run once on startup and again whenever the locale changes.
 */
export function applyLocaleMetadata() {
  const { t, locale } = i18n.global

  document.documentElement.lang = locale.value
  document.title = t('website.meta.title')
  setMetaContent('description', t('website.meta.description'))

  const skipLink = document.querySelector('.skip-link')
  if (skipLink) skipLink.textContent = t('website.skipLink')
}
