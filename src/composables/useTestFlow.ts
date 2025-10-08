import { computed, onMounted, ref, watch } from 'vue'
import { isMobile } from '@/util/etc'
import type { Diff } from '@/util/test/scoring'
import useTimers from '@/mixins/timers'
import { delayAfterScoring, delayBeforeStarting } from '@/components/animation'
import { isNull } from 'lodash-es'

/**
 * Common state management for test flows (Practice and Lesson modes).
 * Handles state transitions between STARTING → TESTING → SCORING.
 */

export enum TestFlowState {
  STARTING,
  TESTING,
  SCORING
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
}

export function useTestFlow(options: TestFlowOptions = {}) {
  const { addTimer } = useTimers()

  const state = ref<TestFlowState>(
    options.initialState ?? (isMobile ? TestFlowState.TESTING : TestFlowState.STARTING)
  )
  const diff = ref<Diff | null>(null)
  const penalty = ref<number | null>(null)

  // Computed state checks
  const isStarting = computed(() => state.value === TestFlowState.STARTING)
  const isTesting = computed(() => state.value === TestFlowState.TESTING)
  const isScoring = computed(() => state.value === TestFlowState.SCORING)
  const showResult = computed(
    () => isScoring.value && !isNull(diff.value) && !isNull(penalty.value)
  )

  function onTestingFinished({ diff: d, penalty: p }: { diff: Diff; penalty: number }) {
    state.value = TestFlowState.SCORING
    diff.value = d
    penalty.value = p

    options.onScoringStart?.(d, p)
  }

  function resetToStart() {
    state.value = isMobile ? TestFlowState.TESTING : TestFlowState.STARTING
    diff.value = null
    penalty.value = null
  }

  function handleStateChange() {
    if (state.value === TestFlowState.STARTING) {
      addTimer(delayBeforeStarting, () => {
        state.value = TestFlowState.TESTING
        options.onTestingStart?.()
      })
    } else if (state.value === TestFlowState.SCORING) {
      addTimer(delayAfterScoring, () => {
        if (!isNull(diff.value) && !isNull(penalty.value)) {
          options.onScoringComplete?.(diff.value, penalty.value)
        }
        resetToStart()
      })
    }
  }

  onMounted(() => handleStateChange())
  watch(state, () => handleStateChange())

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
    resetToStart
  }
}
