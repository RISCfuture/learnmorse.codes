<template>
  <div class="test-symbols">
    <transition appear mode="out-in" name="in-grow-out-grow-linear">
      <start-typing v-if="showStartTyping" key="startTyping" />
      <field
        v-else
        key="test"
        :lesson="lesson"
        @abandon="emit('abandon')"
        @finished="onFinished($event)"
        @finishing="onFinishing"
      />
    </transition>

    <transition appear name="in-grow-out-fade">
      <pencils-down v-if="showPencilsDown" />
    </transition>
  </div>
</template>

<script setup lang="ts">
import StartTyping from '@/views/home/lesson/test/StartTyping.vue'
import PencilsDown from '@/views/home/lesson/test/PencilsDown.vue'
import Field from '@/views/home/lesson/test/Field.vue'
import { isMobile } from '@/util/etc'
import { onMounted, ref, watch } from 'vue'
import useTimers from '@/mixins/timers'
import { delayBeforeScoring, delayBeforeTyping } from '@/components/animation'
import type { Diff } from '@/util/test/scoring'
import { stopAllAudio } from '@/util/morse/audio'

/**
 * Runs the test portion of the lesson flow. Displays the "Start typing!" prompt, then shows the
 * test field. Displays the "Pencils down" prompt as the test finishes.
 */

const { addTimer, cancelTimers } = useTimers()

const props = defineProps<{ lesson: number }>()

const emit = defineEmits<{
  abandon: []
  finished: [{ diff: Diff; penalty: number }]
}>()

const showStartTyping = ref(!isMobile)
const showPencilsDown = ref(false)

function onFinishing() {
  cancelTimers()
  showPencilsDown.value = true
  addTimer(delayBeforeScoring, () => (showPencilsDown.value = false))
}

function onFinished({ diff, penalty }: { diff: Diff; penalty: number }) {
  stopAllAudio()
  emit('finished', { diff, penalty })
}

function reset() {
  cancelTimers()
  showStartTyping.value = !isMobile
  addTimer(delayBeforeTyping, () => (showStartTyping.value = false))
}

onMounted(() => reset())

watch(
  () => props.lesson,
  () => reset()
)
</script>
