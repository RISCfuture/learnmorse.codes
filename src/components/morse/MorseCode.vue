<template>
  <div class="morse-code">
    <segment v-for="(segment, index) in sequence" :key="index" :segment="segment" />
  </div>
</template>

<script setup lang="ts">
import Segment from '@/components/morse/Segment.vue'
import { computed } from 'vue'
import { messageToSequence, textToMessage } from '@/util/morse/code'

/**
 * Renders a Morse code sequence in pictograph form. Note that the resulting pictograph is styled
 * as `no-wrap`, so it will overflow a smaller container.
 */

const props = defineProps<{
  /** The plaintext to render in Morse code pictographs. */
  text: string
}>()

const sequence = computed(() => messageToSequence(textToMessage(props.text)))
</script>
