import { symbolsInLesson } from '@/data/koch'
import wordList from '@/data/words.json'

/** Minimum number of words required to use real words instead of random characters */
const MIN_WORD_THRESHOLD = 15

/**
 * Gets the base word list.
 * Uses the top 10,000 most common English words from Wikipedia.
 * Words are ordered by frequency (most common first).
 */
function getBaseWordList(): string[] {
  return wordList
}

/**
 * Filters words to only include those that can be composed from the given character set.
 *
 * @param wordList Array of words to filter (should be pre-sorted by frequency)
 * @param allowedChars Set of characters that are allowed
 * @return Filtered array of words, maintaining frequency order
 */
function filterWordsByCharacterSet(wordList: string[], allowedChars: Set<string>): string[] {
  return wordList.filter((word) => {
    // Check if word contains only allowed characters
    const wordChars = word.toLowerCase().split('')
    return wordChars.every((char) => allowedChars.has(char))
  })
}

/**
 * Cache of filtered word lists by lesson number.
 * Computed once on first access for performance.
 */
const wordListCache: Map<number, string[]> = new Map()

/**
 * Gets the list of words that can be used for a given lesson.
 * Words are filtered to only include characters learned up to that lesson.
 *
 * @param lesson The lesson number (zero-indexed)
 * @return Array of valid words for this lesson
 */
export function getWordsForLesson(lesson: number): string[] {
  // Check cache first
  if (wordListCache.has(lesson)) {
    return wordListCache.get(lesson)!
  }

  // Get allowed characters for this lesson
  const allowedChars = new Set(symbolsInLesson(lesson))

  // Filter base word list
  const baseWords = getBaseWordList()
  const filteredWords = filterWordsByCharacterSet(baseWords, allowedChars)

  // Cache the result
  wordListCache.set(lesson, filteredWords)

  return filteredWords
}

/**
 * Determines if a lesson has enough words available to use real words
 * instead of random character generation.
 *
 * @param lesson The lesson number (zero-indexed)
 * @return True if lesson has enough words (>= MIN_WORD_THRESHOLD)
 */
export function hasEnoughWords(lesson: number): boolean {
  const wordList = getWordsForLesson(lesson)
  return wordList.length >= MIN_WORD_THRESHOLD
}

/**
 * Selects random words from the lesson's word list, weighted by frequency.
 * More common words (earlier in the list) have higher probability of being selected.
 *
 * Since words are already ordered by frequency, we use a weighted random selection
 * where earlier words (more common) are more likely to be chosen.
 *
 * @param lesson The lesson number
 * @param count Number of words to select
 * @param mustContain Optional character that all selected words must contain
 * @return Array of randomly selected words, weighted toward more common words
 */
export function selectRandomWords(lesson: number, count: number, mustContain?: string): string[] {
  let wordList = getWordsForLesson(lesson)

  // Filter to only words containing the required character if specified
  if (mustContain) {
    wordList = wordList.filter((word) => word.includes(mustContain))
    if (wordList.length === 0) return []
  }

  const selectedWords: string[] = []

  for (let i = 0; i < count; i++) {
    // Use weighted random selection
    // Generate a random number that favors lower indices (more common words)
    // Using a quadratic distribution: random^2 gives more weight to earlier words
    const randomValue = Math.random()
    const weightedRandom = randomValue * randomValue // Square to heavily favor common words
    const index = Math.floor(weightedRandom * wordList.length)

    selectedWords.push(wordList[index]!)
  }

  return selectedWords
}
