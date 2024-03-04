<template>
  <p>
    {{ t('lesson.copy.grading') }}
  </p>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

/**
 * Displays the "Pencils down!" warning when the test is ending.
 */

const { t } = useI18n()
</script>

<style scoped lang="scss">
@use '@/assets/styles/colors';
@use '@/assets/styles/responsive';

p {
  @include responsive.font-size-large;
  @include colors.muted;
}
</style>
