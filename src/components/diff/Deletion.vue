<template>
  <div>
    <p class="symbol">
      {{ $filters.symbol(change.remove) }}
    </p>
    <img class="correction" src="@/assets/images/Elide.svg" :alt="t('lesson.practice.elide')" />
  </div>
</template>

<script setup lang="ts">
import type { Deletion } from '@/util/test/scoring'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps<{ change: Deletion }>()
</script>

<style scoped lang="scss">
div {
  position: relative;
}

img {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
}
</style>
