<template>
  <div data-cy="resume" id="resume">
    <transition appear mode="out-in" name="in-fade-1">
      <h1>{{$t('website.resume.text')}}</h1>
    </transition>
    <transition appear mode="out-in" name="in-fade-1">
      <a @click.prevent="resume" class="button" data-cy="resumeButton">
        {{$t('website.resume.button')}}
      </a>
    </transition>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { sharedAudioContext } from '@/util/morse/audio'

  /**
   * Displayed to a user who visits the website who has recorded progress in their local storage.
   * Allows them to continue where they left off. Clicking the "Resume" button begins the learning
   * and testing flow, and resumes the audio context.
   */

  @Component
  export default class Resume extends Vue {
    resume(): void {
      sharedAudioContext().resume()
      this.$emit('started')
    }
  }
</script>

<style lang="scss" scoped>
  @use 'src/assets/styles/colors';
  @use 'src/assets/styles/responsive';

  h1 {
    @include responsive.bottom-margin-huge;
  }
</style>
