<template>
  <div id="resume">
    <transition appear mode="out-in" name="in-fade-1">
      <h1>{{ t('website.resume.text') }}</h1>
    </transition>
    <transition appear mode="out-in" name="in-fade-1">
      <a href="#" class="button" @click.prevent="resume">
        {{ t('website.resume.button') }}
      </a>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { sharedAudioContext } from '@/util/morse/audio'
import { useI18n } from 'vue-i18n'

/**
 * Displayed to a user who visits the website who has recorded progress in their local storage.
 * Allows them to continue where they left off. Clicking the "Resume" button begins the learning
 * and testing flow, and resumes the audio context.
 */

const { t } = useI18n()

const emit = defineEmits<{
  started: []
}>()

function resume() {
  sharedAudioContext().resume()
  emit('started')
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/colors';
@use '@/assets/styles/responsive';

h1 {
  @include responsive.bottom-margin-huge;
}
</style>
