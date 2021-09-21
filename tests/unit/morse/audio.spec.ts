/* eslint-disable no-underscore-dangle,@typescript-eslint/no-empty-function */
/* eslint-disable class-methods-use-this,@typescript-eslint/no-explicit-any */

import { expect } from 'chai'
import Sinon from 'sinon'
import { last } from 'lodash-es'
import MorseCodeAudio from '@/util/morse/audio'

class OscillatorNode {
  // eslint-disable-next-line no-use-before-define
  _context: AudioContext

  frequency = {
    setValueAtTime: Sinon.fake()
  }

  // eslint-disable-next-line no-use-before-define
  constructor(context: AudioContext) {
    this._context = context
  }

  start(time: number) {
    this._context._events.push(['start', time])
  }

  stop(time: number) {
    this._context._events.push(['stop', time])
  }

  connect() {
  }

  disconnect() {
  }
}

class GainNode {
  gain = { value: 1 }

  connect() {
  }

  disconnect() {
  }
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
      const subject = new MorseCodeAudio('paris ', <any>context)
      subject.play()

      expect(context._events).to.deep.almost.equal([
        ['start', 0.5],
        ['stop', 0.56],
        ['start', 0.62],
        ['stop', 0.8],
        ['start', 0.86],
        ['stop', 1.04],
        ['start', 1.1],
        ['stop', 1.16],
        ['start', 1.40],
        ['stop', 1.46],
        ['start', 1.52],
        ['stop', 1.70],
        ['start', 1.94],
        ['stop', 2],
        ['start', 2.06],
        ['stop', 2.24],
        ['start', 2.30],
        ['stop', 2.36],
        ['start', 2.60],
        ['stop', 2.66],
        ['start', 2.72],
        ['stop', 2.78],
        ['start', 3.02],
        ['stop', 3.08],
        ['start', 3.14],
        ['stop', 3.20],
        ['start', 3.26],
        ['stop', 3.32]
      ])
    })

    it('does nothing given an empty message', () => {
      new MorseCodeAudio('', <any>context).play()
      expect(context._events).to.eql([])
    })
  })
})
