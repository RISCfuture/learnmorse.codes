import { messageToSequence, Segment, textToMessage } from '@/util/morse/code'
import { ditDurationPulse, ditDurationSpace, segmentUnitWidth } from '@/util/morse/timing'

const toneFrequency = 800

const allNodes: AudioNode[] = []

/**
 * Stops all in-progress and pending audio tasks.
 */

export function stopAllAudio() {
  let node: AudioNode | undefined

  while ((node = allNodes.pop())) {
    node.disconnect()
  }
}

let globalContext: AudioContext | null = null

/**
 * Custom error class for audio context unavailability.
 * This error is user-facing and should not be logged to Sentry.
 */
export class AudioContextUnavailableError extends Error {
  constructor() {
    super('Audio playback is not supported in your browser')
    this.name = 'AudioContextUnavailableError'
  }
}

/**
 * Returns the shared AudioContext used throughout the website. This AudioContext will be resumed
 * once the user has clicked the button and to begin or resume learning.
 *
 * @throws {AudioContextUnavailableError} If AudioContext is not available in the browser
 */
export function sharedAudioContext(): AudioContext {
  if (!globalContext) {
    // Check if AudioContext is available (some browsers, particularly older iOS Safari, don't support it)
    if (typeof AudioContext === 'undefined') {
      throw new AudioContextUnavailableError()
    }
    globalContext = new AudioContext()
  }
  return globalContext
}

function segmentDuration(segment: Segment) {
  switch (segment) {
    case Segment.SHORT_SPACE:
    case Segment.LONG_SPACE:
      return ditDurationSpace * segmentUnitWidth[segment]
    case Segment.DIT:
    case Segment.DAH:
    case Segment.INTRA_SEGMENT:
      return ditDurationPulse * segmentUnitWidth[segment]
    default:
      return 0
  }
}

/**
 * Returns the amount of time it will take to play a Morse code sequence, not including any padding
 * on either end.
 *
 * @param sequence The Morse code sequence.
 * @return The amount of time (seconds).
 */

export function sequenceDuration(sequence: Segment[]): number {
  return sequence.reduce((duration, segment) => duration + segmentDuration(segment), 0)
}

/**
 * This class converts Morse code sequences into audio and plays them through the default output.
 * Because most Web browsers will not play audio without user interaction first, it's necessary to
 * call `sharedAudioContext().resume()` in a user-interaction hook (such as `onClick`). Once this is
 * done, the ability to play audio is preserved until the user reloads or closes the window.
 */

export default class MorseCodeAudio {
  private readonly context: AudioContext

  private readonly gainNode: GainNode

  private readonly text: string

  /**
   * Creates an instance to generate Morse code audio.
   *
   * @param text The plaintext to convert into Morse code.
   * @param context An audio context to use. (Leave as default except for testing.)
   */

  constructor(text: string, context: AudioContext = sharedAudioContext()) {
    this.text = text
    this.context = context

    this.gainNode = context.createGain()
    this.gainNode.gain.value = 0.75
    this.gainNode.connect(this.context.destination)
  }

  private playSequence(sequence: Segment[], startDelay: number) {
    stopAllAudio()

    let time = this.context.currentTime + startDelay
    sequence.forEach((segment) => {
      switch (segment) {
        case Segment.INTRA_SEGMENT:
        case Segment.SHORT_SPACE:
        case Segment.LONG_SPACE:
          time += segmentDuration(segment)
          break
        case Segment.DIT:
        case Segment.DAH: {
          const oscillator = this.createOscillator()
          oscillator.start(time)
          time += segmentDuration(segment)
          oscillator.stop(time)
          break
        }
      }
    })
  }

  private createOscillator(): OscillatorNode {
    const oscillator = this.context.createOscillator()
    oscillator.frequency.setValueAtTime(toneFrequency, this.context.currentTime)
    oscillator.connect(this.gainNode)
    allNodes.push(oscillator)
    return oscillator
  }

  /**
   * Plays the Morse code audio.
   *
   * @param startDelay The amount of time to delay prior to playing the audio (seconds).
   */

  play(startDelay = 0.5) {
    this.playSequence(this.sequence, startDelay)
  }

  private get sequence(): Segment[] {
    return messageToSequence(textToMessage(this.text))
  }

  /**
   * The amount of time it will take to play a Morse code sequence, not including any padding on
   * either end.
   */

  get duration(): number {
    return sequenceDuration(this.sequence)
  }
}
