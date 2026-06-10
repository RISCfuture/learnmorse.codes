import { describe, it, expect, beforeEach, vi } from 'vitest'
import { detectLocale, matchLocale, LOCALE_STORAGE_KEY } from '@/i18n/locales'

function setBrowserLanguages(languages: string[]) {
  Object.defineProperty(navigator, 'languages', { value: languages, configurable: true })
  Object.defineProperty(navigator, 'language', { value: languages[0] ?? '', configurable: true })
}

function setStoredLocale(value: string | null) {
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => (key === LOCALE_STORAGE_KEY ? value : null),
  })
}

describe('matchLocale', () => {
  it('matches an exact tag case-insensitively', () => {
    expect(matchLocale('zh-cn')).toBe('zh-CN')
    expect(matchLocale('ja-JP')).toBe('ja-JP')
  })

  it('matches on the primary language subtag', () => {
    expect(matchLocale('zh-Hans')).toBe('zh-CN')
    expect(matchLocale('ja-JP-x-anything')).toBe('ja-JP')
    expect(matchLocale('en-US')).toBe('en')
  })

  it('returns null for an unsupported language', () => {
    expect(matchLocale('fr-FR')).toBeNull()
  })
})

describe('detectLocale', () => {
  beforeEach(() => {
    setStoredLocale(null)
  })

  it('prefers a valid persisted choice over browser preferences', () => {
    setStoredLocale('ja-JP')
    setBrowserLanguages(['zh-CN'])
    expect(detectLocale()).toBe('ja-JP')
  })

  it('ignores an unsupported persisted value and falls back to the browser', () => {
    setStoredLocale('fr-FR')
    setBrowserLanguages(['zh-CN'])
    expect(detectLocale()).toBe('zh-CN')
  })

  it('matches an exact supported browser locale', () => {
    setBrowserLanguages(['ja-JP', 'en-US'])
    expect(detectLocale()).toBe('ja-JP')
  })

  it('maps a base-language preference to a supported regional locale', () => {
    setBrowserLanguages(['zh-Hans', 'en-US'])
    expect(detectLocale()).toBe('zh-CN')
  })

  it('falls back to en when no preference is supported', () => {
    setBrowserLanguages(['fr-FR', 'ko-KR'])
    expect(detectLocale()).toBe('en')
  })
})
