<template>
  <div>
    <h1>{{ t('lesson.copy.abandoned.header') }}</h1>
    <p>{{ t('lesson.copy.abandoned.body') }}</p>
    <a href="#" class="button" @click.prevent="emit('retry')">
      {{ t('lesson.copy.abandoned.retryButton') }}
    </a>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { stopAllAudio } from '@/util/morse/audio'
import { useI18n } from 'vue-i18n'

/**
 * Displays a confirmation when the user is considered to have abandoned the test. Allows the
 * user to review symbols and then restart the test when ready.
 */

const { t } = useI18n()

const emit = defineEmits<{
  retry: []
}>()

onMounted(() => stopAllAudio())
</script>

<style lang="scss" scoped>
@use '@/assets/styles/responsive';

p {
  @include responsive.bottom-margin-large;
}

.button {
  display: inline-block;

  @include responsive.font-size-large;
}
</style>
