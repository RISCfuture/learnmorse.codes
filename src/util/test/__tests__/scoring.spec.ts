import { describe, it, expect } from 'vitest'
import { calculateDiff, type Diff, extraCredit, scoreLossForAnswer } from '../scoring'

describe('calculateDiff', () => {
  it('returns an empty diff for empty strings', () => {
    expect(calculateDiff('', '')).toEqual({
      penalty: 0,
      changes: []
    })
  })

  it('returns an unchanged diff for identical strings', () => {
    expect(calculateDiff('foo', 'foo')).toEqual({
      penalty: 0,
      changes: [{ unchanged: 'f' }, { unchanged: 'o' }, { unchanged: 'o' }]
    })
  })

  it('returns additions for suffixes in expected', () => {
    expect(calculateDiff('foobar', 'foo')).toEqual({
      penalty: 3,
      changes: [
        { unchanged: 'f' },
        { unchanged: 'o' },
        { unchanged: 'o' },
        { add: 'b' },
        { add: 'a' },
        { add: 'r' }
      ]
    })
  })

  it('returns deletions for suffixes in actual', () => {
    expect(calculateDiff('foo', 'foobar')).toEqual({
      penalty: 3,
      changes: [
        { unchanged: 'f' },
        { unchanged: 'o' },
        { unchanged: 'o' },
        { remove: 'b' },
        { remove: 'a' },
        { remove: 'r' }
      ]
    })
  })

  it('returns additions for prefixes in expected', () => {
    expect(calculateDiff('foobar', 'bar')).toEqual({
      penalty: 3,
      changes: [
        { add: 'f' },
        { add: 'o' },
        { add: 'o' },
        { unchanged: 'b' },
        { unchanged: 'a' },
        { unchanged: 'r' }
      ]
    })
  })

  it('returns deletions for prefixes in actual', () => {
    expect(calculateDiff('bar', 'foobar')).toEqual({
      penalty: 3,
      changes: [
        { remove: 'f' },
        { remove: 'o' },
        { remove: 'o' },
        { unchanged: 'b' },
        { unchanged: 'a' },
        { unchanged: 'r' }
      ]
    })
  })

  it('returns substitutions', () => {
    expect(calculateDiff('Saturday', 'Sunday')).toEqual({
      penalty: 3,
      changes: [
        { unchanged: 'S' },
        { add: 'a' },
        { add: 't' },
        { unchanged: 'u' },
        { replace: 'n', with: 'r' },
        { unchanged: 'd' },
        { unchanged: 'a' },
        { unchanged: 'y' }
      ]
    })
  })

  it('does not penalize for wrong case', () => {
    expect(calculateDiff('Saturday', 'sunday')).toEqual({
      penalty: 3,
      changes: [
        { replace: 's', with: 'S' },
        { add: 'a' },
        { add: 't' },
        { unchanged: 'u' },
        { replace: 'n', with: 'r' },
        { unchanged: 'd' },
        { unchanged: 'a' },
        { unchanged: 'y' }
      ]
    })
  })

  it('does not penalize for missing or extra spaces', () => {
    expect(calculateDiff('Saturday', 'Sun day')).toEqual({
      penalty: 3,
      changes: [
        { unchanged: 'S' },
        { add: 'a' },
        { add: 't' },
        { unchanged: 'u' },
        { replace: 'n', with: 'r' },
        { remove: ' ' },
        { unchanged: 'd' },
        { unchanged: 'a' },
        { unchanged: 'y' }
      ]
    })

    expect(calculateDiff(' foobar', 'bar')).toEqual({
      penalty: 3,
      changes: [
        { add: ' ' },
        { add: 'f' },
        { add: 'o' },
        { add: 'o' },
        { unchanged: 'b' },
        { unchanged: 'a' },
        { unchanged: 'r' }
      ]
    })
  })
})

describe('extraCredit', () => {
  it('sums the number of correct space bar hits', () => {
    const diff: Diff = {
      penalty: 0,
      changes: [
        { add: 'a' },
        { unchanged: 'a' },
        { unchanged: ' ' },
        { unchanged: ' ' },
        { remove: 'a' },
        { replace: 'a', with: 'b' },
        { add: ' ' },
        { unchanged: ' ' },
        { remove: ' ' },
        { replace: ' ', with: 'b' },
        { replace: 'a', with: ' ' },
        { add: 'b' },
        { unchanged: 'b' },
        { unchanged: ' ' },
        { remove: 'b' },
        { replace: 'b', with: 'c' }
      ]
    }
    expect(extraCredit(diff)).toEqual(4)
  })
})

describe('scoreLossForAnswer', () => {
  it('returns the percentage of correct characters, not including spaces', () => {
    const diff: Diff = {
      penalty: 3,
      changes: []
    }
    expect(scoreLossForAnswer('foo', diff)).toEqual(1)
    expect(scoreLossForAnswer('foobar', diff)).toEqual(0.5)
  })
})
