<template>
  <div id="get-started">
    <transition
      appear
      mode="out-in"
      name="in-fade-1"
    >
      <h1>{{ $t('website.getStarted.line1') }}</h1>
    </transition>
    <transition
      appear
      mode="out-in"
      name="in-fade-2"
    >
      <h2>{{ $t('website.getStarted.line2') }}</h2>
    </transition>
    <transition
      appear
      mode="out-in"
      name="in-fade-3"
    >
      <a
        href="#"
        class="button"
        data-cy="getStartedButton"
        @click.prevent="getStarted"
      >
        {{ $t('website.getStarted.button') }}
      </a>
    </transition>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { sharedAudioContext } from '@/util/morse/audio'

  /**
   * The first page displayed to a new user who visits the website. Presents a "Start" button, that
   * when clicked, activates the audio context and begins the learning and testing flow.
   */

  @Component
  export default class Start extends Vue {
    getStarted(): void {
      sharedAudioContext().resume()
      this.$emit('started')
    }
  }
</script>

<style lang="scss" scoped>
  @use "src/assets/styles/colors";
  @use "src/assets/styles/responsive";

  h2 {
    @include responsive.bottom-margin-huge;
  }
</style>
