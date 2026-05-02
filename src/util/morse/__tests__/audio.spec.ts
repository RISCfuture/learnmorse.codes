import { describe, it, expect, vi, beforeEach } from 'vitest'
import { last } from 'lodash-es'
import MorseCodeAudio from '../audio'

class OscillatorNode {
  public context: AudioContext

  public frequency = {
    setValueAtTime: vi.fn(),
  }

  public constructor(context: AudioContext) {
    this.context = context
  }

  public start(time: number) {
    this.context.events.push(['start', time])
  }

  public stop(time: number) {
    this.context.events.push(['stop', time])
  }

  public connect() {}

  public disconnect() {}
}

class GainNode {
  public gain = { value: 1 }

  public connect() {}

  public disconnect() {}
}

class AudioContext {
  public oscillators: OscillatorNode[] = []

  public events: [string, number][] = []

  public currentTime = 0

  public createOscillator(): OscillatorNode {
    this.oscillators.push(new OscillatorNode(this))
    return last(this.oscillators)!
  }

  public createGain(): GainNode {
    return new GainNode()
  }
}

describe('MorseCodeAudio', () => {
  describe('play', () => {
    let context: AudioContext

    beforeEach(() => {
      context = new AudioContext()
    })

    it('plays a message', () => {
      const subject = new MorseCodeAudio('paris ', context as never)
      subject.play()

      expect(context.events).toHaveEvents([
        ['start', 0.5],
        ['stop', 0.56],
        ['start', 0.62],
        ['stop', 0.8],
        ['start', 0.86],
        ['stop', 1.04],
        ['start', 1.1],
        ['stop', 1.16],
        ['start', 1.4],
        ['stop', 1.46],
        ['start', 1.52],
        ['stop', 1.7],
        ['start', 1.94],
        ['stop', 2],
        ['start', 2.06],
        ['stop', 2.24],
        ['start', 2.3],
        ['stop', 2.36],
        ['start', 2.6],
        ['stop', 2.66],
        ['start', 2.72],
        ['stop', 2.78],
        ['start', 3.02],
        ['stop', 3.08],
        ['start', 3.14],
        ['stop', 3.2],
        ['start', 3.26],
        ['stop', 3.32],
      ])
    })

    it('does nothing given an empty message', () => {
      new MorseCodeAudio('', context as never).play()
      expect(context.events).toEqual([])
    })
  })
})
