import { random, sample, times } from 'lodash-es'
import { newSymbolsInLesson, symbolsInLesson } from '@/data/koch'
import { replaceAt } from '@/util/etc'
import { hasEnoughWords, selectRandomWords } from './wordList'

const wordLengths = [1, 6]
const messageLengths = [14, 18]

/**
 * Generates a random answer for a given lesson's test. The answer will consist only of the
 * characters the user has learned thus far. At least 10% of the characters in the answer will come
 * from the symbols introduced in the current lesson.
 *
 * When enough words are available (15+), test answers use real English words. Otherwise,
 * they are gibberish with a completely random arrangement of letters and symbols, grouped
 * into "words" of reasonable length.
 *
 * @param lesson The lesson to generate a test answer for.
 * @return The generated test answer.
 */

export default function generateAnswer(lesson: number): string {
  let answer: string
  const useWords = hasEnoughWords(lesson)

  // Use real words if enough are available for this lesson
  if (useWords) {
    answer = generateAnswerFromWords(lesson)
  } else {
    answer = generateRandomAnswer(lesson)
  }

  // guarantee about 10% of the answer is our symbol(s) we just learned
  answer = ensureNewSymbols(answer, lesson, useWords)

  return answer
}

/**
 * Generates an answer using real English words that can be formed from
 * the characters available at this lesson level.
 *
 * Words are selected with weighted randomness, favoring more common words.
 * If punctuation has been learned, it's inserted between words.
 *
 * @param lesson The lesson number
 * @return Answer string composed of real words
 */
function generateAnswerFromWords(lesson: number): string {
  const wordsToGenerate = random(messageLengths[0]!, messageLengths[1]!)
  const availableSymbols = symbolsInLesson(lesson)

  // Check which punctuation marks are available
  const punctuation = ['.', ',', '?', '!']
  const availablePunctuation = punctuation.filter((p) => availableSymbols.includes(p))

  // Select words with frequency-weighted randomness
  const selectedWords = selectRandomWords(lesson, wordsToGenerate)

  // If we have punctuation available, insert it occasionally
  if (availablePunctuation.length > 0) {
    const wordsWithPunctuation: string[] = []

    for (let i = 0; i < selectedWords.length; i++) {
      let word = selectedWords[i]!

      // Add punctuation after some words (not the last word, ~30% chance)
      // Attach punctuation directly to the word without spaces
      if (i < selectedWords.length - 1 && Math.random() < 0.3) {
        word += sample(availablePunctuation)!
      }

      wordsWithPunctuation.push(word)
    }

    return wordsWithPunctuation.join(' ')
  }

  return selectedWords.join(' ')
}

/**
 * Generates an answer using random character sequences grouped into "words".
 * This is the original behavior used when not enough real words are available.
 *
 * @param lesson The lesson number
 * @return Answer string of random characters
 */
function generateRandomAnswer(lesson: number): string {
  const wordsToGenerate = random(messageLengths[0]!, messageLengths[1]!)
  const words = times(wordsToGenerate, () => {
    const wordLength = random(wordLengths[0]!, wordLengths[1]!)
    const symbols = times(wordLength, () => sample(symbolsInLesson(lesson)))
    return symbols.join('')
  })

  return words.join(' ')
}

/**
 * Ensures that approximately 10% of the characters in the answer are
 * from the newly learned symbols for this lesson.
 *
 * For word-based answers, we substitute whole words that contain the new symbol
 * rather than corrupting existing words.
 *
 * @param answer The answer string to modify
 * @param lesson The lesson number
 * @param isWordBased Whether the answer is composed of real words
 * @return Modified answer with new symbols inserted
 */
function ensureNewSymbols(answer: string, lesson: number, isWordBased: boolean = false): string {
  const newSymbols = newSymbolsInLesson(lesson)
  const newSymbol = newSymbols[0]! // Usually just one symbol per lesson

  // Calculate target number of new symbols (10% of total alphanumeric length)
  // Don't count spaces or standalone punctuation in the length
  const alphanumericLength = answer.replace(/\s+/g, '').replace(/[.,?!]/g, '').length
  const targetCount = Math.round(alphanumericLength / 10.0)

  if (targetCount > 0) {
    if (isWordBased) {
      // For word-based answers, substitute whole words that contain the new symbol
      const words = answer.split(' ')

      // Get words that contain the new symbol
      const wordsWithNewSymbol = selectRandomWords(lesson, words.length, newSymbol)

      if (wordsWithNewSymbol.length > 0) {
        // Calculate how many words to substitute to reach target character count
        let charsToAdd = targetCount
        let wordsSubstituted = 0

        for (let i = 0; i < words.length && charsToAdd > 0; i++) {
          const replacementWord = wordsWithNewSymbol[wordsSubstituted % wordsWithNewSymbol.length]!
          const newSymbolCount = replacementWord.split('').filter((c) => c === newSymbol).length

          if (newSymbolCount > 0) {
            words[i] = replacementWord
            charsToAdd -= newSymbolCount
            wordsSubstituted++
          }
        }
      }

      answer = words.join(' ')
    } else {
      // For random answers, replace anywhere except spaces
      times(targetCount, () => {
        let index = random(answer.length)
        // Skip spaces
        let attempts = 0
        while (answer[index] === ' ' && attempts < 100) {
          index = random(answer.length)
          attempts++
        }
        if (answer[index] !== ' ') {
          answer = replaceAt(answer, index, newSymbol)
        }
      })
    }
  }

  return answer
}
