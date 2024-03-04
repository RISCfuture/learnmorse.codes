import { describe, it, expect } from 'vitest'
import { newSymbolsInLesson, symbolsInLesson } from '../koch'

describe('newSymbolsInLesson', () => {
  it('returns the first two symbols for the first lesson', () => {
    expect(newSymbolsInLesson(0)).toEqual(['k', 'm'])
  })

  it('returns the symbol for another lesson', () => {
    expect(newSymbolsInLesson(1)).toEqual(['r'])
    expect(newSymbolsInLesson(2)).toEqual(['s'])
  })
})

describe('symbolsInLesson', () => {
  it('returns the first two symbols for the first lesson', () => {
    expect(symbolsInLesson(0)).toEqual(['k', 'm'])
  })

  it('returns the symbol for another lesson', () => {
    expect(symbolsInLesson(1)).toEqual(['k', 'm', 'r'])
    expect(symbolsInLesson(2)).toEqual(['k', 'm', 'r', 's'])
  })
})
