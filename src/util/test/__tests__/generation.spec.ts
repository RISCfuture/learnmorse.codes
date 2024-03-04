import { describe, it, expect } from 'vitest'
import generateAnswer from '../generation'
import { uniq } from 'lodash-es'
import { newSymbolsInLesson, symbolOrder } from '../../../data/koch'
import { occurrences } from '../../etc'

describe('generateAnswer', () => {
  it('generates answers using the appropriate symbol set for lesson #1', () => {
    const answer = generateAnswer(0)
    const set = uniq(answer.split(''))
    symbolOrder
      .slice(2)
      .split('')
      .forEach((c) => expect(set).not.toContain(c))
  })

  it('generates answers using the appropriate symbol set for lesson #10', () => {
    const answer = generateAnswer(10)
    const set = uniq(answer.split(''))
    symbolOrder
      .slice(12)
      .split('')
      .forEach((c) => expect(set).not.toContain(c))
  })

  it('ensures at least 10% of the symbols are the newest one learned', () => {
    const answer = generateAnswer(20)
    const symbols = newSymbolsInLesson(20)
    expect(occurrences(answer, symbols[0])).toBeGreaterThanOrEqual(Math.round(answer.length / 10.0))
  })
})
