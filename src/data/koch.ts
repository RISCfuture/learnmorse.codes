/** The order in which the user learns new symbols. */
export const symbolOrder = 'kmrsuaptlowi.njef0y,vg5/q9zh38b?427c1d6x\'!"&()+-:=@'

/**
 * The symbols that the user can be tested on for a lesson. Includes the symbols introduced in this
 * lesson and all prior lessons.
 *
 * @param lesson The lesson number (zero-indexed).
 * @return The symbols the user can be tested on.
 */
export function symbolsInLesson(lesson: number): string[] {
  if (lesson === 0) return symbolOrder.slice(0, 2).split('')
  return symbolOrder.slice(0, lesson + 2).split('')
}

/**
 * The new symbols introduced in a lesson.
 *
 * @param lesson The lesson number (zero-indexed).
 * @return The new symbols.
 */
export function newSymbolsInLesson(lesson: number): string[] {
  if (lesson === 0) return symbolOrder.slice(0, 2).split('')
  return symbolOrder.slice(lesson + 1, lesson + 2).split('')
}

/** The highest lesson number, after passing which the syllabus is considered completed. */
export const lastLessonNumber = symbolOrder.length - 2
