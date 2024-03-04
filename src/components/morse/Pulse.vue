<template>
  <svg height="10" :width="widthPixels" xmlns="http://www.w3.org/2000/svg">
    <path :d="path" :class="colorClass" fill-rule="evenodd" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    color: string
    width: number
  }>(),
  {
    color: 'transparent',
    width: 1
  }
)

const widthPixels = computed(() => props.width * 10)
const colorClass = computed(() => `color-${props.color}`)
const path = computed(() => `M0 0h${widthPixels.value}v10H0z`)
</script>

<style scoped lang="scss">
@use '@/assets/styles/colors';

.color-text {
  @include colors.theme using ($theme) {
    fill: colors.get($theme, 'text-color');
  }
}

.color-transparent {
  fill: transparent;
}
</style>
