<template>
  <div v-if="hasError" class="audio-error-guard">
    <div class="error-content">
      <h1>{{ t('errors.audioUnavailable.title') }}</h1>
      <p>{{ t('errors.audioUnavailable.message') }}</p>
    </div>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const hasError = ref(false)

function showError() {
  hasError.value = true
}

defineExpose({
  showError
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/colors';
@use '@/assets/styles/responsive';

.audio-error-guard {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;

  @include colors.theme using($theme) {
    background-color: colors.get($theme, 'background');
  }
}

.error-content {
  text-align: center;
  padding: 2rem;
  max-width: 600px;

  h1 {
    @include responsive.font-size-very-large;
    margin-bottom: 1.5rem;

    @include colors.theme using($theme) {
      color: colors.get($theme, 'text-color');
    }
  }

  p {
    @include responsive.font-size-regular;
    line-height: 1.6;

    @include colors.theme using($theme) {
      color: colors.get($theme, 'text-color');
    }
  }
}
</style>
