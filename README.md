# Learn Morse Code

**Learn Morse Code** is a website that teaches Morse code in a way that's
lighthearted, affirming, but also intentionally a little pushy. The website
requires little user interaction other that transcribing the Morse code
sequences, ensuring that users are marched "by default" towards completion.

This website uses the Koch method for learning Morse code. Morse code is
presented to the learner at full speed (20 WPM) from the beginning, and speed is
not varied as the lesson progresses. Instead, the alphabet starts small (just
the letters "K" and "M"), and increases as the user passes each lesson. A 90%
pass rate is required to move to the next lesson.

To aid in learning, a slight amount of Farnsworth compression is used. The
effective speed is 18 WPM at 20 Farns. The benchmark word "PARIS " is used for
calculated WPM rates.

### Technology Overview

Learn Morse Code is written in Vue.js, and transpiled using Vue-CLI. Morse code
audio is generated entirely programmatically using the AudioContext API, which
is supported on virtually all modern browsers. Morse code pictographs are also
generated entirely programmatically as SVGs.

The application is single-page, with Vue handling transitioning between its
different states. Local Storage is used to record the user's progress so s/he
can resume it upon revisiting the website.

## Installation and Usage

To develop Learn Morse Code, you must have Node.js version 12 (or better) and
Yarn installed. (End-to-end testing with Cypress will require additional
platform dependencies.)

Simply check out the website and run `yarn install` to install all dependencies.

Yarn scripts are provided to accomplish all common development tasks:

* `yarn serve`: Launches a development server on port 8080. This server supports
  both hot-redrawing and hot-reloading.
* `yarn build`: Builds the production website into the `dist/` directory.
* `yarn test:unit`: Runs unit tests.
* `yarn test:e2e`: Launches the Cypress app for running end-to-end tests.
* `yarn docs:generate`: Generates HTML API documentation into `doc/`.
* `yarn lint`: Runs all linters. Normally this is done automatically upon
  commit.

## Architecture

### Terminology

**symbol**: A character within a plaintext (non-encoded) string.

**text**: A plaintext (non-encoded) string consisting of _symbols_.

**mark**: The presence of a signal during a Morse code transmission.

**gap**: The absence of a signal during a Morse code transmission.

**frame**: A fixed-width time period during which there can be either a _mark_
or a _gap_.

**pulse**: A _mark_ lasting a defined number of _frames_.

**dit** or `.`: A short _pulse_, or the width of such a _pulse_.

**dah** or `-`: A long _pulse_, whose width is a fixed multiplier of a _dit_.

**space**: A _gap_ lasting a defined number of _frames_. A **short space** is
one _dit_ long, and a **long space** is one _dah_ long.

**segment**: A _pulse_ or a _space_.

**sequence**: A succession of _pulses_ representing a single _symbol_ encoded
into Morse code.

**word**: A succession of _sequences_ forming a word (typically followed by a
space or punctuation sequence).

**message**: A Morse-encoded _text_, a succession of _segments_.

### Application Flow

A new user begins in the **welcome** state. From there they can move to the
**lesson** state, where they learn new symbols and complete tests. Once they
complete all the lessons, they move to the **completed** state. From there, they
have the option to reset back to the _welcome_ state, or to move to the
**practice** state where they can perform endless practice.

A returning user begins in the **resume** state. From there they move to the
_lesson_ state to resume their lessons. If a returning user has already
completed all lessons, they move directly to the _completed_ state.

Note that only a few states require user interaction to transition (_welcome_,
_resume_, _completed_). The other states transition between each other in an
automated manner using timers.

#### Lesson States

The view for the lesson state has its own sub-states: A lesson starts in the
**learn** state, where the user is presented the new symbol(s) s/he is learning.
From there, the user moves automatically to the **test** state, where the s/he
hears a Morse code message and transcribes it to a text field. Finally, the
user is automatically moved to the **results** state, where his/her results are
displayed.

If the result is a pass (90% or better transcription accuracy), the user is
advanced to the next lesson and returned to the _learn_ state. If not, the
lesson number is unchanged, the user is returned to the _learn_ state, and the
symbols that s/he missed are highlighted before moving automatically to the
_test_ state.

If, while in the _test_ state, no keyboard input is detected for a period of
five seconds, the test is aborted and the user is moved to the **abandoned**
state. The user must click a button to return back to the _learn_ state and
retry.

### View Structure

The root application view is the {Home} Vue. `Home` maintains
the top-level application state (see above) and transitions between different
subviews used for each of those states.

The {Lesson} Vue is the top level state manager for the lesson flow. It
transitions between the different lesson sub-states (see above).

Each of these views selects between many different subviews. The subviews are
named after the states they handle. There are also a few utility views:

* {@link MorseCode} is a Vue that renders a pictograph of a Morse code message 
  as an SVG image.
* {@link Diff} is a Vue that renders a diff in a somewhat-playful "copy-editor"
  format.

### Morse Code Conversion

The functions in `src/util/morse/code.ts` handle conversion between plaintext
and Morse code. These functions do not handle drawing Morse code or converting
it to audio, only working with Morse code as an abstract representation via the
{Segment} interface.

The `src/data/morse.ts` file contains the dictionary of Morse code symbols. The
`src/util/morse/timing.ts` contains constants and calculations for determining
the proper timing (in dits) of the different Morse sequences, and the realtime
durations of dits and dahs to accomplish the configured WPM and Farns.

### Audio Generation

The {MorseCodeAudio} class converts a sequence (`Segment[]`) into a waveform
using the AudioContext API and plays that waveform over the default audio
device.

Because most Web browsers do not allow websites to play audio until the user
interacts with an interface element, the `src/util/morse/audio.ts` file exports
a {sharedAudioContext} function that returns a singleton audio context. This
audio context is activated when the user clicks the "Get started" button upon
visiting the page, and plays all audio thereafter.

The `MorseCodeAudio` class is effectively multi-channel. To prevent overlapping
Morse code audio, a {stopAllAudio} function is provided.

### Levels

The `src/data/koch.ts` file is used to generate lesson content. This file
contains the ordering of symbols as they are presented in successive lessons.

### Test Generation and Scoring

Random tests are generated using {generateAnswer}. This method generates tests
using all the symbols covered on the lesson passed to it as well as all
antecedent lessons.

The `src/util/test/scoring.ts` contains all the code for generating diffs
between the user's answer and the correct answer, and determining the user's
score from the diff (and thus whether s/he proceeds to the next lesson).

## Testing (…the code, not like, the testing that users do on the website)

Unit tests are provided for core functionality (such as Morse code generation
and diff generation); run with `yarn test:unit`. These tests are written using
Mocha as the test framework and Chai as the expectation framework. Sinon is used
for fakes, etc.

A shim `AudioContext` is provided for the testing environment (which doesn't
have an actual `AudioContext`, and is dependency-injected into 
`MorseCodeAudio`).

End-to-end tests can be run with `yarn test:e2e`. The tests are run using
Cypress. Note that animations are not suppressed during E2E tests, so they can
take a bit of time to run. The E2E tests are stateful and interdependent: They
must be run in the order they are written in order to properly succeed.

There is a `.travis.yml` configuration for Travis CI as well.

## Deployment

Learn Morse Code is hosted using GitHub pages. The `deploy.rb` script creates
the `dist/` directory, makes it point to the `gh-pages` branch of this
repository, deploys into that directory, commits the changes, and then pushes
those changes upstream. GitHub should automatically handle the rest.
