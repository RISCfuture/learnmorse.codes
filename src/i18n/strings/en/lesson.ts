import type { LocaleMessage } from '@intlify/core-base'

const lesson: LocaleMessage = {
  copy: {
    getReady: 'Get ready...',
    getReadyButton: 'Gimme the test!',
    startTyping: 'Start typing!',
    grading: 'Pencils down!',
    extraCredit:
      '...plus an extra point for typing that space! | ...plus {points} extra points for typing those spaces!',
    abandoned: {
      header: 'Did it get away from you?',
      body: 'Looks like things maybe fell apart for a bit there. Take a breath, review the symbols above if you need to, and when you’re ready, press the big gray button below.',
      retryButton: 'OK. Let’s go again.'
    },
    fieldLabel: 'type here'
  },
  platitudes: {
    encouragement: [
      'Don’t quit now!',
      'You’re almost there!',
      'You’ll get it!',
      'Keep on trying!',
      'I believe in you!',
      'Practice makes perfect!',
      'You can do it!',
      'You can do this!',
      'Never give up, never surrender!',
      'Get those gains!',
      'One more try!',
      'You know you got this!'
    ],
    congratulations: [
      'Good job!',
      'Amazing!',
      'Great work!',
      'Kick-ass!',
      'You’re awesome!',
      'So proud of you!',
      'Who’s killing it? You’re killing it!',
      'Pat yourself on the back!',
      'You earned this!',
      'Your work is paying off!',
      'Sweet flex!',
      '💯💯💯',
      '✨✨✨'
    ]
  },
  tips: [
    'Press the space bar when you hear a longer pause, because that indicates a new word.',
    'Don’t think about the dots and dashes. Try to learn what each symbol SOUNDS like.',
    'Close your eyes when you study the sound of each symbol.',
    'Use the left and right arrows to move between lessons.'
  ],
  practice: {
    elide: 'elide',
    insert: 'insert'
  }
}
export default lesson
