<template>
  <div id="test">
    <a v-if="!startedOnMobile" href="#" class="button" @click.prevent="startOnMobile">
      {{ t('lesson.copy.getReadyButton') }}
    </a>

    <input
      id="test-input"
      ref="testInputEl"
      v-model="testInput"
      autocapitalize="off"
      autocomplete="off"
      autocorrect="off"
      spellcheck="false"
      type="text"
      :aria-label="t('lesson.copy.fieldLabel')"
      :class="{ started: startedOnMobile }"
      @keydown.passive="onActivity"
    />

    <input :value="answer" data-testid="answerKey" type="hidden" />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { isMobile } from '@/util/etc'
import { isNull } from 'lodash-es'
import {
  delayAroundAudio,
  delayBeforeAbandoned,
  delayBeforeScoring,
  delayBeforeTyping
} from '@/components/animation'
import useTimers, { type Timer } from '@/mixins/timers'
import generateAnswer from '@/util/test/generation'
import MorseCodeAudio from '@/util/morse/audio'
import { calculateDiff, type Diff, scoreLossForAnswer } from '@/util/test/scoring'

/**
 * Displays the input field for the test. This view also handles tracking test abandonment. This
 * view implements two different behaviors depending on whether the user is on mobile or on a
 * desktop browser.
 *
 * On desktop, the text field is immediately displayed and focus is moved to the text field
 * automatically. The test begins when the view is instantiated.
 *
 * Mobile devices generally don't allow focus to be moved without explicit user input. So, the
 * text field is hidden, and a "Start test" button is shown. When the button is clicked, focus
 * is transferred to the text field, the button is hidden, and the test begins.
 */

const { t } = useI18n()
const { addTimer, cancelTimers } = useTimers()
const emit = defineEmits<{
  abandon: []
  finishing: []
  finished: [{ diff: Diff; penalty: number }]
}>()

const props = defineProps<{ lesson: number }>()

const testInputEl = ref<HTMLInputElement | null>(null)
const answer = ref('')
const testInput = ref('')
const activityTimer = ref<Timer | null>(null)
const startedOnMobile = ref(!isMobile)

function updateStartedOnMobile() {
  startedOnMobile.value = document.activeElement === testInputEl.value
}

function onActivity(event?: KeyboardEvent) {
  if (isMobile && !startedOnMobile.value) return
  if (event?.key === 'Enter') finishTest()

  if (!isNull(activityTimer.value)) clearTimeout(activityTimer.value)
  activityTimer.value = setTimeout(() => emit('abandon'), delayBeforeAbandoned)
}

function startOnMobile() {
  if (testInputEl.value) testInputEl.value.focus()
  startedOnMobile.value = true
  onActivity()
  startTest()
}

function reset() {
  cancelTimers()
  if (!isMobile) addTimer(delayBeforeTyping, () => startTest())

  if (!isNull(activityTimer.value)) {
    clearTimeout(activityTimer.value)
    activityTimer.value = null
  }

  answer.value = generateAnswer(props.lesson)
  console.log(answer.value)

  onActivity()

  testInput.value = ''
  if (testInputEl.value) testInputEl.value.focus()
}

function startTest() {
  const audio = new MorseCodeAudio(answer.value)
  audio.play(delayAroundAudio)

  addTimer((audio.duration + delayAroundAudio * 2) * 1000, () => {
    finishTest()
  })
}

function finishTest() {
  emit('finishing')
  addTimer(delayBeforeScoring, () => scoreTest())
}

function scoreTest() {
  const diff = calculateDiff(answer.value, testInput.value)
  const penalty = scoreLossForAnswer(answer.value, diff)
  emit('finished', { diff, penalty })
}

onMounted(() => {
  reset()
  document.addEventListener('focus', updateStartedOnMobile)
})

onUnmounted(() => document.removeEventListener('focus', updateStartedOnMobile))

watch(
  () => props.lesson,
  () => reset()
)
</script>

<style lang="scss" scoped>
@use '@/assets/styles/colors';
@use '@/assets/styles/responsive';

#test-input {
  @include responsive.font-size-very-large;
  @include colors.muted;

  &:not(.started) {
    opacity: 0;
  }
}
</style>
