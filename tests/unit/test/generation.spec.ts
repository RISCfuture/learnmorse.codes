import { expect } from 'chai'
import { uniq } from 'lodash-es'
import generateAnswer from '@/util/test/generation'
import { newSymbolsInLesson, symbolOrder } from '@/data/koch'
import { occurrences } from '@/util/etc'

describe('generateAnswer', () => {
  it('generates answers using the appropriate symbol set for lesson #1', () => {
    const answer = generateAnswer(0)
    const set = uniq(answer.split(''))
    symbolOrder.slice(2).split('').forEach(c => expect(set).not.to.include(c))
  })

  it('generates answers using the appropriate symbol set for lesson #10', () => {
    const answer = generateAnswer(10)
    const set = uniq(answer.split(''))
    symbolOrder.slice(12).split('').forEach(c => expect(set).not.to.include(c))
  })

  it('ensures at least 10% of the symbols are the newest one learned', () => {
    const answer = generateAnswer(20)
    const symbols = newSymbolsInLesson(20)
    expect(occurrences(answer, symbols[0])).to.be.gte(Math.round(answer.length / 10.0))
  })
})
