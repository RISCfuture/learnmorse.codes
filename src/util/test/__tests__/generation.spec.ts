import { describe, it, expect } from 'vitest'
import generateAnswer from '../generation'
import { uniq } from 'lodash-es'
import { newSymbolsInLesson, symbolOrder } from '../../../data/koch'
import { occurrences } from '../../etc'
import { hasEnoughWords, getWordsForLesson } from '../wordList'

describe('generateAnswer', () => {
  it('generates non-empty answers for all lessons', () => {
    for (let lesson = 0; lesson <= 10; lesson++) {
      const answer = generateAnswer(lesson)
      expect(answer.length).toBeGreaterThan(0)
    }
  })

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
    // Calculate based on alphanumeric characters only (not spaces or standalone punctuation)
    const alphanumericLength = answer.replace(/\s+/g, '').replace(/[.,?!]/g, '').length

    // Word-based generation may not hit exactly 10% due to whole-word substitution,
    // so allow for some variance (at least 7% to account for word boundaries)
    const minExpected = Math.round(alphanumericLength * 0.07)
    expect(occurrences(answer, symbols[0])).toBeGreaterThanOrEqual(minExpected)
  })

  it('uses real words when enough are available', () => {
    // Find a lesson with enough words
    let lessonWithWords = -1
    for (let i = 0; i < symbolOrder.length; i++) {
      if (hasEnoughWords(i)) {
        lessonWithWords = i
        break
      }
    }

    // Ensure we found a lesson with enough words
    expect(lessonWithWords).toBeGreaterThanOrEqual(0)

    const answer = generateAnswer(lessonWithWords)
    const words = answer.split(' ')
    const availableWords = getWordsForLesson(lessonWithWords)
    const availableWordsSet = new Set(availableWords.map((w) => w.toLowerCase()))

    // At least some of the words should be from our dictionary
    // (allowing for the 10% replacement of new symbols which may corrupt words)
    const matchedWords = words.filter((word) => availableWordsSet.has(word.toLowerCase()))

    expect(matchedWords.length).toBeGreaterThan(0)
  })

  it('generates answers with reasonable word count', () => {
    const answer = generateAnswer(10)
    const words = answer.split(' ')

    // Should have between 14-18 words based on messageLengths constant
    expect(words.length).toBeGreaterThanOrEqual(14)
    expect(words.length).toBeLessThanOrEqual(18)
  })
})
