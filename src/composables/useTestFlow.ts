import { computed, onMounted, ref, watch } from 'vue'
import { isMobile } from '@/util/etc'
import type { Diff } from '@/util/test/scoring'
import { useTimeoutFn } from '@vueuse/core'
import { delayAfterScoring, delayBeforeStarting } from '@/components/animation'

/**
 * Common state management for test flows (Practice and Lesson modes).
 * Lesson mode has a learn-then-test cadence: it sits in LEARNING while symbols are
 * demonstrated, then transitions LEARNING → STARTING → TESTING → SCORING. Practice mode
 * skips LEARNING and starts at STARTING.
 */

export enum TestFlowState {
  LEARNING,
  STARTING,
  TESTING,
  SCORING,
}

export interface TestFlowOptions {
  /** Callback when entering TESTING state */
  onTestingStart?: () => void
  /** Callback when entering SCORING state with results */
  onScoringStart?: (diff: Diff, penalty: number) => void
  /** Callback when scoring phase completes */
  onScoringComplete?: (diff: Diff, penalty: number) => void
  /** Initial state override (default: STARTING or TESTING on mobile) */
  initialState?: TestFlowState
  /** State to return to after a scoring cycle completes (default: matches initialState) */
  resetState?: TestFlowState
}

export function useTestFlow(options: TestFlowOptions = {}) {
  const defaultStart = isMobile ? TestFlowState.TESTING : TestFlowState.STARTING
  const initialState = options.initialState ?? defaultStart
  const postScoringState = options.resetState ?? initialState

  const state = ref(initialState)
  const diff = ref<Diff | null>(null)
  const penalty = ref<number | null>(null)

  // Computed state checks
  const isStarting = computed(() => state.value === TestFlowState.STARTING)
  const isTesting = computed(() => state.value === TestFlowState.TESTING)
  const isScoring = computed(() => state.value === TestFlowState.SCORING)
  const showResult = computed(
    () => isScoring.value && diff.value !== null && penalty.value !== null,
  )

  const startingTimer = useTimeoutFn(
    () => {
      state.value = TestFlowState.TESTING
      options.onTestingStart?.()
    },
    delayBeforeStarting,
    { immediate: false },
  )
  const scoringTimer = useTimeoutFn(
    () => {
      if (diff.value !== null && penalty.value !== null) {
        options.onScoringComplete?.(diff.value, penalty.value)
      }
      resetToStart()
    },
    delayAfterScoring,
    { immediate: false },
  )

  function onTestingFinished({ diff: d, penalty: p }: { diff: Diff; penalty: number }) {
    state.value = TestFlowState.SCORING
    diff.value = d
    penalty.value = p

    options.onScoringStart?.(d, p)
  }

  function resetToStart() {
    state.value = postScoringState
    diff.value = null
    penalty.value = null
  }

  function handleStateChange() {
    if (state.value === TestFlowState.STARTING) {
      startingTimer.start()
    } else if (state.value === TestFlowState.SCORING) {
      scoringTimer.start()
    }
  }

  onMounted(() => {
    handleStateChange()
  })
  watch(state, () => {
    handleStateChange()
  })

  return {
    // State
    state,
    diff,
    penalty,

    // Computed
    isStarting,
    isTesting,
    isScoring,
    showResult,

    // Methods
    onTestingFinished,
    resetToStart,
  }
}
