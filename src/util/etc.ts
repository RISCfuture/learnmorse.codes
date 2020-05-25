import { isNull } from 'lodash-es'

export function occurrences(string: string, substring: string): number {
  if (string.length === 0 || substring.length === 0) return 0

  let count = 0
  for (let i = 0; i !== string.length; i++) {
    if (string.slice(i, i + substring.length) === substring) count++
  }
  return count
}

export function replaceAt(string: string, index: number, replacement: string): string {
  return string.substr(0, index) + replacement + string.substr(index + replacement.length)
}

export const isMobile = !isNull(window.navigator.userAgent.match(/(iPhone|iPad|Android)/))
