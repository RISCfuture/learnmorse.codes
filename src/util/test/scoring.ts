import { has, isUndefined, memoize, minBy } from 'lodash-es'

/**
 * Represents a character that was not changed between the expected and actual.
 */

export interface Unchanged {
  /** The character that was unchanged. */
  unchanged: string
}

/**
 * Represents a character that must be inserted to convert the actual into the expected.
 */

export interface Insertion {
  /** The character that must be inserted. */
  add: string
}

/**
 * Represents a character that must be removed to convert the actual into the expected.
 */

export interface Deletion {
  /** The character that must be removed. */
  remove: string
}

/**
 *  Represents a character that must be replaced with another to convert the actual into the
 *  expected.
 */

export interface Replacement {
  /** The character that must be replaced. */
  replace: string

  /** The character to replace it with. */
  with: string
}

/** A single-character change within a diff. */
export type Change = Unchanged | Insertion | Deletion | Replacement

/** Returns `true` if the {@link Change} is an {@link Unchanged}. */
export function isUnchanged(change: Change): change is Unchanged {
  return has(change, 'unchanged')
}

/** Returns `true` if the {@link Change} is an {@link Insertion}. */
export function isInsertion(change: Change): change is Insertion {
  return has(change, 'add')
}

/** Returns `true` if the {@link Change} is a {@link Deletion}. */
export function isDeletion(change: Change): change is Deletion {
  return has(change, 'remove')
}

/** Returns `true` if the {@link Change} is a {@link Replacement}. */
export function isSubstitution(change: Change): change is Replacement {
  return has(change, 'replace')
}

/**
 * A set of changes necessary to transform a user-provided string into the expected string, and
 * the final penalty resulting from these changes.
 */

export interface Diff {
  /** The changes to transform a user-provided string into an expected string. */
  changes: Change[]

  /**
   * The penalty (as points) resulting from these changes. This number is essentially the
   * total Levenshtein distance of these changes (with no gain in distance for missing spaces or
   * capitalization differences).
   *
   * @see penaltyForString
   */
  penalty: number
}

function penaltyFor(char1: string, char2?: string) {
  if (isUndefined(char2)) return char1 === ' ' ? 0 : 1
  return char1.toLowerCase() === char2.toLowerCase() ? 0 : 1
}

function penaltyForString(string: string) {
  return string.split('').reduce((sum, c) => sum + penaltyFor(c), 0)
}

function rawCalculateDiff(expected: string, actual: string): Diff {
  if (expected === actual) {
    return {
      penalty: 0,
      changes: expected.split('').map((c) => ({ unchanged: c }))
    }
  }

  if (expected === '') {
    return {
      penalty: penaltyForString(actual),
      changes: actual.split('').map((c) => ({ remove: c }))
    }
  }

  if (actual === '') {
    return {
      penalty: penaltyForString(expected),
      changes: expected.split('').map((c) => ({ add: c }))
    }
  }

  const expectedMinusFirst = expected.slice(1)
  const actualMinusFirst = actual.slice(1)

  if (expected.startsWith(actual[0]!)) {
    const diffRest = calculateDiff(expectedMinusFirst, actualMinusFirst)
    return {
      penalty: diffRest.penalty,
      changes: [{ unchanged: expected[0]! }, ...diffRest.changes]
    }
  }

  const deletionRest = calculateDiff(expected, actualMinusFirst)
  const deletion: Diff = {
    penalty: deletionRest.penalty + penaltyFor(actual[0]!),
    changes: [{ remove: actual[0]! }, ...deletionRest.changes]
  }

  const insertionRest = calculateDiff(expectedMinusFirst, actual)
  const insertion: Diff = {
    penalty: insertionRest.penalty + penaltyFor(expected[0]!),
    changes: [{ add: expected[0]! }, ...insertionRest.changes]
  }

  const substitutionRest = calculateDiff(expectedMinusFirst, actualMinusFirst)
  const substitution: Diff = {
    penalty: substitutionRest.penalty + penaltyFor(expected[0]!, actual[0]!),
    changes: [{ replace: actual[0]!, with: expected[0]! }, ...substitutionRest.changes]
  }

  return minBy([substitution, deletion, insertion], (diff) => diff.penalty)!
}

/**
 * Calculates the difference (and score penalty) between two strings.
 *
 * @param expected The expected string (the correct answer).
 * @param actual The user-provided string.
 * @return The difference between the two.
 */

export const calculateDiff = memoize(rawCalculateDiff, (a, b) => JSON.stringify([a, b]))

/**
 * Returns `true` if the user's score is better than 90%.
 * @param score The user's score.
 * @return Whether that score is a pass.
 */

export function isPass(score: number): boolean {
  return score <= 0.1 // 90% or better accuracy
}

/**
 * Returns the number of "extra credit" points the user earned. Extra credit is earned for correctly
 * typing spaces where indicated by the Morse code (though the points are all imaginary).
 *
 * @param diff The diff from the test.
 * @return The number of points.
 */

export function extraCredit(diff: Diff): number {
  return diff.changes.reduce((sum, change) => {
    if (isUnchanged(change) && change.unchanged === ' ') return sum + 1
    return sum
  }, 0)
}

/**
 * Calculates the amount to deduct from a perfect score (as a fraction of 1) based on the penalty
 * points. Penalty points are divided by the testable length of the string.
 *
 * @param answer The correct answer.
 * @param diff The diff from the user's answer.
 * @return The fraction to deduct from a perfect score (0 to 1).
 */

export function scoreLossForAnswer(answer: string, diff: Diff): number {
  const answerChars = answer.replace(/ /g, '').length
  return diff.penalty / answerChars
}
