<template>
  <div>
    <p class="symbol">
      {{ $filters.symbol(change.unchanged) }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { Unchanged } from '@/util/test/scoring'

defineProps<{ change: Unchanged }>()
</script>

<style scoped lang="scss">
@use '@/assets/styles/colors';

p {
  @include colors.theme using ($theme) {
    color: colors.get($theme, 'pass');
  }
}
</style>
