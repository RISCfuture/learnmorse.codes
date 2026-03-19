export function occurrences(string: string, substring: string): number {
  if (string.length === 0 || substring.length === 0) return 0

  let count = 0
  for (let i = 0; i !== string.length; i++) {
    if (string.slice(i, i + substring.length) === substring) count++
  }
  return count
}

export function replaceAt(string: string, index: number, replacement: string): string {
  return string.slice(0, index) + replacement + string.slice(index + replacement.length)
}

export const isMobile = /(iPhone|iPad|Android)/.exec(window.navigator.userAgent) !== null
