import { expect } from 'vitest'

type Event = [string, number]

expect.extend({
  toHaveEvents(actual: Event[], expected: Event[], precision: number) {
    const delta = Math.pow(10, -precision)

    let pass = true
    if (actual.length !== expected.length) {
      pass = false
    } else {
      for (let i = 0; i < actual.length; i++) {
        if (!this.equals(actual[i][0], expected[i][0]) || Math.abs(actual[i][1] - expected[i][1]) > delta) {
          pass = false
          break
        }
      }
    }

    return {
      pass,
      message: () => `Expected ${this.utils.stringify(actual)} to be close to ${this.utils.stringify(expected)}`,
      actual,
      expected
    }
  }
})
