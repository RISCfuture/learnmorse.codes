<template>
  <p>{{ platitude }}</p>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { sample } from 'lodash-es'
import { useI18n } from 'vue-i18n'

/**
 * Displays an encouraging message to the user if they failed the test, or an affirming message if
 * they succeeded.
 */

const { tm } = useI18n()

const props = defineProps<{ pass: boolean }>()

const platitude = computed(() => {
  const path = `lesson.platitudes.${props.pass ? 'congratulations' : 'encouragement'}`
  const strings = tm(path) as string[]
  return sample(strings)!
})
</script>

<style scoped lang="scss">
@use '@/assets/styles/colors';
@use '@/assets/styles/responsive';

p {
  @include responsive.font-size-large;
}
</style>
