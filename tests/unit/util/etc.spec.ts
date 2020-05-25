import { expect } from 'chai'
import { occurrences } from '@/util/etc'

describe('occurrences', () => {
  it('returns the number of occurrences of substring in string', () => {
    expect(occurrences('foofofoofoofffoofoffoooofoofofo', 'foo')).to.eql(6)
  })

  it('returns zero if there are no occurrences', () => {
    expect(occurrences('foo', 'bar')).to.eql(0)
  })

  it('handles empty strings', () => {
    expect(occurrences('', 'foo')).to.eql(0)
    expect(occurrences('foo', '')).to.eql(0)
    expect(occurrences('', '')).to.eql(0)
  })
})
