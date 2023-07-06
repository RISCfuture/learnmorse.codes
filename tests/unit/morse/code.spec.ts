import { expect } from 'chai'
import { messageToSequence, textToMessage } from '@/util/morse/code'

describe('textToMessage', () => {
  it('converts a string into Morse code', () => {
    expect(textToMessage('paris ')).to.eql('.--. .- .-. .. ...\t')
    expect(textToMessage('Hello, world!')).to.eql('.... . .-.. .-.. --- --..--\t.-- --- .-. .-.. -.. -.-.--')
    expect(textToMessage('')).to.eql('')
    expect(textToMessage('a')).to.eql('.-')
    expect(textToMessage('hi')).to.eql('.... ..')
  })
})

describe('messageToSegments', () => {
  it('converts a string into segments', () => {
    expect(messageToSequence('.--. .- .-. .. ...\t')).
      to.eql([
        1, 0, 111, 0, 111, 0, 1, 10, 1, 0, 111, 10, 1, 0,
        111, 0, 1, 10, 1, 0, 1, 10, 1, 0, 1, 0, 1, 100
      ])
    expect(messageToSequence('')).
      to.eql([])
    expect(messageToSequence('.')).
      to.eql([1])
    expect(messageToSequence('..')).
      to.eql([1, 0, 1])
  })
})
