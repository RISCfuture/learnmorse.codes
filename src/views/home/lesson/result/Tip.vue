<template>
  <p>{{ tip }}</p>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { sample } from 'lodash-es'
import { useI18n } from 'vue-i18n'

/**
 * Displays a tip to help the user learn. Tips are displayed occasionally in place of
 * {@link Platitude}s.
 */

const { tm } = useI18n()

const tip = computed(() => sample(tm('lesson.tips') as string[])!)
</script>

<style scoped lang="scss">
@use '@/assets/styles/colors';
@use '@/assets/styles/responsive';

p {
  @include responsive.top-margin-large;
  @include colors.muted;
}
</style>
