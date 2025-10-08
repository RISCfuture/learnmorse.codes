<template>
  <div
    id="lesson"
    ref="lessonEl"
    role="region"
    :aria-label="t('lesson.copy.navigation.label')"
    :aria-keyshortcuts="ariaKeyshortcuts"
  >
    <span class="sr-only">{{ t('lesson.copy.navigation.instructions') }}</span>

    <learn
      ref="learnSymbols"
      :audio="symbolGuidePlaysAudio"
      :interactive="symbolGuideIsInteractive"
      :lesson="currentLesson"
      @finished="readyToTest"
    />

    <transition appear mode="out-in" name="in-fade-out-fade">
      <result v-if="showResult" key="scoring" :diff="diff!" :penalty="penalty!" :show-diff="true" />

      <get-ready v-else-if="isStarting" key="starting" />

      <abandoned v-else-if="isAbandoned" key="abandoned" @retry="readyToTest" />

      <test
        v-else-if="isTesting"
        key="testing"
        :lesson="currentLesson"
        @abandon="onAbandoned"
        @finished="onTestingFinished($event)"
      />
    </transition>
  </div>
</template>

<script setup lang="ts">
import Abandoned from '@/views/home/lesson/Abandoned.vue'
import GetReady from '@/views/home/lesson/GetReady.vue'
import Result from '@/views/home/lesson/Result.vue'
import Test from '@/views/home/lesson/Test.vue'
import Learn from '@/views/home/lesson/Learn.vue'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { type Diff, isInsertion, isPass, isSubstitution } from '@/util/test/scoring'
import { useLessonStore } from '@/stores/lesson'
import { isMobile } from '@/util/etc'
import useTimers from '@/mixins/timers'
import { isNull } from 'lodash-es'
import { newSymbolsInLesson } from '@/data/koch'
import { storeToRefs } from 'pinia'
import { useTestFlow, TestFlowState } from '@/composables/useTestFlow'
import { useSwipe } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

/**
 * Displays the Lesson view, which handles all of the following:
 *
 * * demonstrating new symbols to the user,
 * * testing the user with a Morse code sequence,
 * * presenting the user their score,
 * * advancing or re-testing as appropriate,
 * * and handling abandoned tests.
 *
 * Each of these states is handled by a specific sub-Vue. This view mostly manages the transition
 * between each of these states.
 *
 * Because the {@link Test} view must display its own "Start Test" button on mobile devices, the
 * _starting_ state is skipped on mobile devices. After the learning portion is complete on
 * mobile, the view proceeds directly to the _testing_ state, where the "Start Test" button is
 * shown.
 */

enum State {
  LEARNING,
  ABANDONED
}

const { t } = useI18n()
const { cancelTimers } = useTimers()
const store = useLessonStore()
const { currentLesson } = storeToRefs(store)

const lessonEl = ref<HTMLElement | null>(null)
const learnSymbols = ref<InstanceType<typeof Learn> | null>(null)

const localState = ref(State.LEARNING)

const {
  state: testFlowState,
  diff,
  penalty,
  isStarting,
  isTesting,
  showResult,
  onTestingFinished: handleTestingFinished
} = useTestFlow({
  onScoringComplete: acceptResult
})

const isAbandoned = computed(() => localState.value === State.ABANDONED)

const symbolGuideIsInteractive = computed(() => localState.value !== State.LEARNING)
const symbolGuidePlaysAudio = computed(() => !isTesting.value)

// ARIA keyboard shortcuts attribute
const ariaKeyshortcuts = computed(() => 'ArrowLeft ArrowRight')

// Swipe gesture support for mobile navigation
useSwipe(lessonEl, {
  onSwipeEnd: (_e, direction) => {
    // Only handle swipes when not in text input
    if (document.activeElement?.tagName === 'INPUT') return

    if (direction === 'left') {
      store.incrementLesson()
    } else if (direction === 'right') {
      store.decrementLesson()
    }
  },
  threshold: 50 // Minimum distance for swipe detection (in pixels)
})

function readyToTest() {
  testFlowState.value = isMobile ? TestFlowState.TESTING : TestFlowState.STARTING
}

function onKeyPress(event: KeyboardEvent) {
  if (event.target instanceof HTMLInputElement) return

  switch (event.key) {
    case 'ArrowLeft':
      store.decrementLesson()
      break
    case 'ArrowRight':
      store.incrementLesson()
      break
  }
}

function onTestingFinished({ diff: d, penalty: p }: { diff: Diff; penalty: number }) {
  handleTestingFinished({ diff: d, penalty: p })
}

function onAbandoned() {
  if (isTesting.value) localState.value = State.ABANDONED
}

function acceptResult() {
  if (isNull(penalty.value)) localState.value = State.LEARNING
  else if (isPass(penalty.value)) store.incrementLesson()
  else repeatLesson()
}

function newLesson() {
  cancelTimers()
  localState.value = State.LEARNING
  demoNewSymbols()
}

function repeatLesson() {
  localState.value = State.LEARNING
  demoMissedSymbols()
}

function demoNewSymbols() {
  const symbols = newSymbolsInLesson(currentLesson.value)
  if (learnSymbols.value) learnSymbols.value.demonstrateSymbols(symbols)
}

function demoMissedSymbols() {
  if (isNull(diff.value)) return

  const missedSymbols = new Set<string>()
  diff.value.changes.forEach((c) => {
    if (isInsertion(c)) missedSymbols.add(c.add)
    if (isSubstitution(c)) {
      missedSymbols.add(c.replace)
      missedSymbols.add(c.with)
    }
  })

  if (learnSymbols.value) learnSymbols.value.demonstrateSymbols([...missedSymbols])
}

onMounted(() => {
  window.addEventListener('keyup', onKeyPress)
  newLesson()
})

onUnmounted(() => {
  window.removeEventListener('keyup', onKeyPress)
})

watch(penalty, (penalty) => {
  if (!isNull(penalty) && isPass(penalty)) {
    store.storeSuccess(currentLesson.value)
  }
})

store.$subscribe(() => newLesson())
</script>
