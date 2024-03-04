<template>
  <div>
    <p class="symbol">
      {{ $filters.symbol(change.add) }}
    </p>
    <img class="correction" src="@/assets/images/Insert.svg" :alt="t('lesson.practice.insert')" />
  </div>
</template>

<script setup lang="ts">
import type { Insertion } from '@/util/test/scoring'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps<{ change: Insertion }>()
</script>

<style scoped lang="scss">
@use '@/assets/styles/colors';
@use '@/assets/styles/responsive';

div {
  position: relative;
}

// p {
//   @include colors.theme using ($theme) {
//     color: colors.get($theme, 'fail')
//   }
// }

img {
  position: absolute;
  bottom: -15px;
  left: 10px;
  display: block;

  @include responsive.small {
    bottom: -10px;
    left: 10px;
    width: 50%;
    height: 50%;
  }
}
</style>
