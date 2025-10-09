/**
 * The delay during which "Get ready…" is displayed prior to displaying "Start typing!"
 * (milliseconds).
 */
export const delayBeforeStarting = 3000

/**
 * The delay during which "Start typing!" is displayed prior to the test beginning in earnest
 * (milliseconds).
 */
export const delayBeforeTyping = 250

/** The delay during which "Pencils down!" is displayed prior to the test ending (milliseconds). */
export const delayBeforeScoring = 3000

/**
 * The length of time the user’s test score is shown on the screen before advancing
 * (milliseconds).
 */
export const delayAfterScoring = 6000

/** The amount of time padding to add to the start and end of Morse code audio (seconds). */
export const delayAroundAudio = 0.5

/**
 * The amount of time that must pass with no user input before the user is considered to have
 * abandoned the test. In E2E testing, this is increased significantly to allow automated typing.
 */
const testMode = import.meta.env.VITE_E2E_TESTING === 'true'
export const delayBeforeAbandoned = testMode ? 60000 : 5000
