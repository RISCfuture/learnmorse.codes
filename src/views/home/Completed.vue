<template>
  <AudioErrorGuard ref="errorGuard">
    <div>
      <h1>{{ t('completed.header') }}</h1>
      <p>{{ t('completed.body') }}</p>

      <div id="buttons">
        <a href="#" class="button" @click.prevent="resetLesson">
          {{ t('completed.resetButton') }}
        </a>
        <a href="#" class="button" @click.prevent="practiceMode">
          {{ t('completed.practiceButton') }}
        </a>
      </div>

      <div id="confetti-1" ref="confetti1" class="confetti" />
      <div id="confetti-2" ref="confetti2" class="confetti" />
      <div id="confetti-3" ref="confetti3" class="confetti" />
    </div>
  </AudioErrorGuard>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import useTimers from '@/mixins/timers'
import { confetti } from 'dom-confetti'
import { sharedAudioContext, AudioContextUnavailableError } from '@/util/morse/audio'
import { isUndefined } from 'lodash-es'
import { useI18n } from 'vue-i18n'
import { useLessonStore } from '@/stores/lesson'
import AudioErrorGuard from '@/components/AudioErrorGuard.vue'

/**
 * Displays the "Completed" page, shown when a user completes all tests in the syllabus. Shoots
 * three confetti bursts from three different parts of the page. Gives the user the option to
 * either restart their progress or continue to practice transcribing Morse code.
 */

const emit = defineEmits<{
  practice: []
}>()
const { t } = useI18n()
const { addTimer } = useTimers()
const { resetLesson } = useLessonStore()
const errorGuard = ref<InstanceType<typeof AudioErrorGuard>>()

const confetti1 = ref<HTMLDivElement>()
const confetti2 = ref<HTMLDivElement>()
const confetti3 = ref<HTMLDivElement>()

onMounted(() => {
  const c1 = confetti1.value
  if (!isUndefined(c1)) addTimer(500, () => confetti(c1))
  const c2 = confetti2.value
  if (!isUndefined(c2)) addTimer(800, () => confetti(c2))
  const c3 = confetti3.value
  if (!isUndefined(c3)) addTimer(1600, () => confetti(c3))
})

function practiceMode() {
  try {
    sharedAudioContext().resume()
    emit('practice')
  } catch (error) {
    if (error instanceof AudioContextUnavailableError) {
      // Show user-friendly error message without logging to Sentry
      errorGuard.value?.showError()
    } else {
      // Re-throw unexpected errors to be caught by Sentry
      throw error
    }
  }
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/responsive';

h1 {
  font-weight: 700;

  @include responsive.font-size-very-large;
}

p {
  @include responsive.font-size-regular;
  @include responsive.bottom-margin-large;
}

#buttons {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;

  a {
    @include responsive.font-size-regular;
  }
}

.confetti {
  position: fixed;
  width: 1px;
  height: 1px;
}

#confetti-1 {
  top: responsive.vh(50);
  left: 20vw;
}

#confetti-2 {
  top: responsive.vh(70);
  left: 80vw;
}

#confetti-3 {
  top: responsive.vh(90);
  left: 50vw;
}
</style>
