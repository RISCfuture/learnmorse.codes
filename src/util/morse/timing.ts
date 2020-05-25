import { round } from 'lodash-es'
import { messageToSequence, Segment, textToMessage } from '@/util/morse/code'

const wordsPerMinute = 20

// actual words per minute before applying Farnsworth compression
const effectiveWordsPerMinute = 18

const benchmarkWord = 'paris '

/** The width, in dits, of each of the segments that make up a Morse code sequence. */
export const segmentUnitWidth = {
  [Segment.INTRA_SEGMENT]: 1,
  [Segment.SHORT_SPACE]: 3,
  [Segment.LONG_SPACE]: 7,
  [Segment.DIT]: 1,
  [Segment.DAH]: 3
}

function unitsInSequence(segments: Segment[]): number {
  return segments.reduce(
    (units, segment) => units + segmentUnitWidth[segment],
    0
  )
}

function spacesInSequence(segments: Segment[]): number {
  return segments.reduce((units, segment) => {
    switch (segment) {
      case Segment.SHORT_SPACE:
      case Segment.LONG_SPACE:
        return units + segmentUnitWidth[segment]
      default:
        return units
    }
  }, 0)
}

const benchmarkSequence = messageToSequence(textToMessage(benchmarkWord))
const ditsPerWord = unitsInSequence(benchmarkSequence)
const secondsPerWord = 60.0 / wordsPerMinute

/** The duration of a dit, in seconds. */
export const ditDurationPulse = secondsPerWord / ditsPerWord

const uncompressedSecondsPerWord = 60.0 / effectiveWordsPerMinute
// we need widen our space such that it makes up the time difference between the uncompressed and
// compressed durations
const durationBetweenWords = uncompressedSecondsPerWord - secondsPerWord

/**
 * The duration of a dit, in seconds, used when calculating the duration of spaces. The different
 * dit lengths for pulses and spaces is how Farnsworth compression is achieved.
 */
export const ditDurationSpace = ditDurationPulse + round(
  durationBetweenWords / spacesInSequence(benchmarkSequence),
  2
)
