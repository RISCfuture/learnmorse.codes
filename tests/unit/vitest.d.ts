import 'vitest'

declare module 'vitest' {
  interface Assertion<T = unknown> {
    toHaveEvents(expected: [string, number][], precision?: number): void
  }
  interface AsymmetricMatchersContaining {
    toHaveEvents(expected: [string, number][], precision?: number): void
  }
}
