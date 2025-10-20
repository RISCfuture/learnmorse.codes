<template>
  <AudioErrorGuard ref="errorGuard">
    <div id="get-started">
      <transition appear mode="out-in" name="in-fade-1">
        <h1>{{ t('website.getStarted.line1') }}</h1>
      </transition>
      <transition appear mode="out-in" name="in-fade-2">
        <h2>{{ t('website.getStarted.line2') }}</h2>
      </transition>
      <transition appear mode="out-in" name="in-fade-3">
        <a href="#" class="button" @click.prevent="getStarted">
          {{ t('website.getStarted.button') }}
        </a>
      </transition>
    </div>
  </AudioErrorGuard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { sharedAudioContext, AudioContextUnavailableError } from '@/util/morse/audio'
import AudioErrorGuard from '@/components/AudioErrorGuard.vue'

/**
 * The first page displayed to a new user who visits the website. Presents a "Start" button, that
 * when clicked, activates the audio context and begins the learning and testing flow.
 */

const { t } = useI18n()
const errorGuard = ref<InstanceType<typeof AudioErrorGuard>>()

const emit = defineEmits<{
  started: []
}>()

function getStarted() {
  try {
    sharedAudioContext().resume()
    emit('started')
  } catch (error) {
    if (error instanceof AudioContextUnavailableError) {
      // Show user-friendly error message without logging to Sentry
      errorGuard.value?.showError()
    } else {
      // Re-throw unexpected errors to be caught by Sentry
      throw error
    }
  }
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/colors';
@use '@/assets/styles/responsive';

h2 {
  @include responsive.bottom-margin-huge;
}
</style>
