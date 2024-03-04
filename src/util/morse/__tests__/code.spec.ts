import { describe, it, expect } from 'vitest'
import { messageToSequence, textToMessage } from '../code'

describe('textToMessage', () => {
  it('converts a string into Morse code', () => {
    expect(textToMessage('paris ')).toEqual('.--. .- .-. .. ...\t')
    expect(textToMessage('Hello, world!')).toEqual(
      '.... . .-.. .-.. --- --..--\t.-- --- .-. .-.. -.. -.-.--'
    )
    expect(textToMessage('')).toEqual('')
    expect(textToMessage('a')).toEqual('.-')
    expect(textToMessage('hi')).toEqual('.... ..')
  })
})

describe('messageToSegments', () => {
  it('converts a string into segments', () => {
    expect(messageToSequence('.--. .- .-. .. ...\t')).toEqual([
      1, 0, 111, 0, 111, 0, 1, 10, 1, 0, 111, 10, 1, 0, 111, 0, 1, 10, 1, 0, 1, 10, 1, 0, 1, 0, 1,
      100
    ])
    expect(messageToSequence('')).toEqual([])
    expect(messageToSequence('.')).toEqual([1])
    expect(messageToSequence('..')).toEqual([1, 0, 1])
  })
})
