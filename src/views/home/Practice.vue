<template>
  <div id="practice">
    <transition appear mode="out-in" name="in-fade-out-fade">
      <get-ready v-if="isStarting" key="starting" />

      <test
        v-else-if="isTesting"
        key="testing"
        :lesson="lesson"
        @finished="onTestingFinished($event)"
      />

      <result
        v-else-if="showResult"
        key="scoring"
        :diff="diff!"
        :penalty="penalty!"
        :show-diff="true"
      />
    </transition>
  </div>
</template>

<script setup lang="ts">
import GetReady from '@/views/home/lesson/GetReady.vue'
import Result from '@/views/home/lesson/Result.vue'
import Test from '@/views/home/lesson/Test.vue'
import { computed, onMounted, ref, watch } from 'vue'
import { isMobile } from '@/util/etc'
import type { Diff } from '@/util/test/scoring'
import { lastLessonNumber } from '@/data/koch'
import useTimers from '@/mixins/timers'
import { delayAfterScoring, delayBeforeStarting } from '@/components/animation'
import { isNull } from 'lodash-es'

/**
 * This view allows a user who has completed all lessons to continue to test him/herself. Very
 * similar to the {@link Lesson} view without the "learning" portion and without lesson
 * advancement (only alternates between {@link Test} and {@link Result}).
 *
 * Because the {@link Test} view must display its own "Start Test" button on mobile devices, the
 * _starting_ state is skipped on mobile devices. After the learning portion is complete on
 * mobile, the view proceeds directly to the _testing_ state, where the "Start Test" button is
 * shown.
 */

const { addTimer } = useTimers()

enum State {
  STARTING,
  TESTING,
  SCORING
}

const state = ref<State>(isMobile ? State.TESTING : State.STARTING)
const diff = ref<Diff | null>(null)
const penalty = ref<number | null>(null)

const lesson = computed(() => lastLessonNumber)
const isStarting = computed(() => state.value === State.STARTING)
const isTesting = computed(() => state.value === State.TESTING)
const isScoring = computed(() => state.value === State.SCORING)
const showResult = computed(() => isScoring.value && !isNull(diff.value) && !isNull(penalty))

function onTestingFinished({ diff: d, penalty: p }: { diff: Diff; penalty: number }) {
  state.value = State.SCORING
  diff.value = d
  penalty.value = p
}

function onStateChange() {
  if (state.value === State.STARTING) {
    addTimer(delayBeforeStarting, () => {
      state.value = State.TESTING
    })
  } else if (state.value === State.SCORING) {
    addTimer(delayAfterScoring, () => {
      state.value = isMobile ? State.TESTING : State.STARTING
    })
  }
}

onMounted(() => onStateChange())
watch(state, () => onStateChange())
</script>

<style lang="scss">
@use '@/assets/styles/responsive';

#practice #test {
  @include responsive.top-margin-large;
}
</style>
