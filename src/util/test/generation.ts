import { random, sample, times } from 'lodash-es'
import { newSymbolsInLesson, symbolsInLesson } from '@/data/koch'
import { replaceAt } from '@/util/etc'

const wordLengths = [1, 6]
const messageLengths = [14, 18]

/**
 * Generates a random answer for a given lesson's test. The answer will consist only of the
 * characters the user has learned thus far. At least 10% of the characters in the answer will come
 * from the symbols introduced in the current lesson.
 *
 * Test answers are gibberish, with a completely random arrangement of letters and symbols, though
 * they are grouped in to "words" of reasonable length.
 *
 * @param lesson The lesson to generate a test answer for.
 * @return The generated test answer.
 */

export default function generateAnswer(lesson: number): string {
  const wordsToGenerate = random(messageLengths[0]!, messageLengths[1]!)
  const words = times(wordsToGenerate, () => {
    const wordLength = random(wordLengths[0]!, wordLengths[1]!)
    const symbols = times(wordLength, () => sample(symbolsInLesson(lesson)))
    return symbols.join('')
  })
  let answer = words.join(' ')

  // guarantee about 10% of the new word is our symbol(s) we just learned

  const newSymbols = newSymbolsInLesson(lesson)
  const symbolsToReplace = Math.round(answer.length / 10.0)
  if (symbolsToReplace > 0) {
    times(symbolsToReplace, () => {
      const index = random(answer.length)
      answer = replaceAt(answer, index, sample(newSymbols)!)
    })
  }

  return answer
}
