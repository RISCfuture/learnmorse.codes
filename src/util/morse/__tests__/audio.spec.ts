import { describe, it, expect, vi, beforeEach } from 'vitest'
import { last } from 'lodash-es'
import MorseCodeAudio from '../audio'

class OscillatorNode {
  _context: AudioContext

  frequency = {
    setValueAtTime: vi.fn()
  }

  constructor(context: AudioContext) {
    this._context = context
  }

  start(time: number) {
    this._context._events.push(['start', time])
  }

  stop(time: number) {
    this._context._events.push(['stop', time])
  }

  connect() {}

  disconnect() {}
}

class GainNode {
  gain = { value: 1 }

  connect() {}

  disconnect() {}
}

class AudioContext {
  _oscillators: OscillatorNode[] = []

  _events: [string, number][] = []

  currentTime = 0

  createOscillator(): OscillatorNode {
    this._oscillators.push(new OscillatorNode(this))
    return last(this._oscillators)!
  }

  createGain(): GainNode {
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

      expect(context._events).toHaveEvents([
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
        ['stop', 3.32]
      ])
    })

    it('does nothing given an empty message', () => {
      new MorseCodeAudio('', context as never).play()
      expect(context._events).toEqual([])
    })
  })
})
