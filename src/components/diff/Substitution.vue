<template>
  <div>
    <p class="symbol">
      {{ $filters.symbol(change.replace) }}
    </p>
    <p class="replacement">
      {{ $filters.symbol(change.with) }}
    </p>
    <img class="correction" src="@/assets/images/Elide.svg" :alt="t('lesson.practice.elide')" />
  </div>
</template>

<script setup lang="ts">
import type { Replacement } from '@/util/test/scoring'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps<{ change: Replacement }>()
</script>

<style scoped lang="scss">
@use '@/assets/styles/responsive';

div {
  position: relative;
}

img {
  position: absolute;
  top: 0;
  left: 5px;
  display: block;
}

.replacement {
  position: absolute;
  top: -30px;
  right: -15px;
  padding: 0;
  margin: 0;
  color: #f00;

  @include responsive.small {
    top: -20px;
    right: -5px;
  }
}
</style>
