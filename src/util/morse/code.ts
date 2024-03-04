import symbolToSequence from '@/data/morse'

/**
 * A segment in a Morse code sequence.
 */
export enum Segment {
  /** The gap between pulses, equal in duration to a dit. */
  INTRA_SEGMENT = 0,

  /** The gap between letters, equal in duration to 3 dits. */
  SHORT_SPACE = 10,

  /** The gap between words, equal in duration to a 7 dits. */
  LONG_SPACE = 100,

  /** A short pulse. */
  DIT = 1,

  /** A long pulse, equal in duration to 3 dits. */
  DAH = 111
}

function isSpace(segment: string) {
  return segment !== '.' && segment !== '-'
}

/**
 * Converts an ASCII representation of a Morse code sequence (such as "-.-- .- -.--") into an
 * abstract representation of the pulses and gaps of that sequence. This sequence can be used with
 * other functions to render the Morse code as a pictograph, or convert it to audio.
 *
 * @param message The ASCII-encoded Morse code message. See {@link symbolToSequence} for the format.
 * @return The abstract Morse code representation.
 */

export function messageToSequence(message: string): Segment[] {
  return message.split('').reduce<Segment[]>((sequence, segment, index) => {
    switch (segment) {
      case '.':
        if (index < message.length - 1 && !isSpace(message[index + 1])) {
          return [...sequence, Segment.DIT, Segment.INTRA_SEGMENT]
        }
        return [...sequence, Segment.DIT]
      case '-':
        if (index < message.length - 1 && !isSpace(message[index + 1])) {
          return [...sequence, Segment.DAH, Segment.INTRA_SEGMENT]
        }
        return [...sequence, Segment.DAH]
      case ' ':
        return [...sequence, Segment.SHORT_SPACE]
      case '\t':
        return [...sequence, Segment.LONG_SPACE]
    }
    return sequence
  }, [])
}

/**
 * Converts a plaintext string (such as "yay") into an ASCII Morse code sequence (such as
 * "-.-- .- -.--"). This method is normally used in concert with {@link messageToSequence} to get an
 * abstract representation of the Morse code.
 *
 * @param text The plaintext.
 * @return The ASCII Morse code representation.
 */

export function textToMessage(text: string): string {
  return text
    .split('')
    .map((symbol) => symbolToSequence[symbol.toLowerCase()])
    .join(' ')
    .replace(/\s*\t\s*/, '\t')
    .replace(/ +/, ' ')
}
