<template>
  <pulse :color="colorClass" :width="width" />
</template>

<script setup lang="ts">
import Pulse from '@/components/morse/Pulse.vue'
import { computed } from 'vue'
import { segmentUnitWidth } from '@/util/morse/timing'
import { Segment } from '@/util/morse/code'

const props = defineProps<{ segment: Segment }>()

const width = computed(() => segmentUnitWidth[props.segment])

const colorClass = computed(() => {
  switch (props.segment) {
    case Segment.DIT:
    case Segment.DAH:
      return 'text'
    default:
      return 'transparent'
  }
})
</script>
