import { expect } from 'chai'
import { newSymbolsInLesson, symbolsInLesson } from '@/data/koch'

describe('newSymbolsInLesson', () => {
  it('returns the first two symbols for the first lesson', () => {
    expect(newSymbolsInLesson(0)).to.eql(['k', 'm'])
  })

  it('returns the symbol for another lesson', () => {
    expect(newSymbolsInLesson(1)).to.eql(['r'])
    expect(newSymbolsInLesson(2)).to.eql(['s'])
  })
})

describe('symbolsInLesson', () => {
  it('returns the first two symbols for the first lesson', () => {
    expect(symbolsInLesson(0)).to.eql(['k', 'm'])
  })

  it('returns the symbol for another lesson', () => {
    expect(symbolsInLesson(1)).to.eql(['k', 'm', 'r'])
    expect(symbolsInLesson(2)).to.eql(['k', 'm', 'r', 's'])
  })
})
