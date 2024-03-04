interface CustomMatchers<R = unknown> {
  toHaveEvents: () => R
}

declare module 'vitest' {
  interface Assertion<T> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
