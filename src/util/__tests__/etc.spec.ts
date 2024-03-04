import { describe, it, expect } from 'vitest'
import { occurrences } from '../etc'

describe('occurrences', () => {
  it('returns the number of occurrences of substring in string', () => {
    expect(occurrences('foofofoofoofffoofoffoooofoofofo', 'foo')).toEqual(6)
  })

  it('returns zero if there are no occurrences', () => {
    expect(occurrences('foo', 'bar')).toEqual(0)
  })

  it('handles empty strings', () => {
    expect(occurrences('', 'foo')).toEqual(0)
    expect(occurrences('foo', '')).toEqual(0)
    expect(occurrences('', '')).toEqual(0)
  })
})
