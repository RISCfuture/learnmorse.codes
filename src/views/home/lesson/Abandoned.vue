<template>
  <div data-cy="abandoned">
    <h1>{{$t('lesson.copy.abandoned.header')}}</h1>
    <p>{{$t('lesson.copy.abandoned.body')}}</p>
    <a @click.prevent="$emit('retry')" class="button" data-cy="retryButton">
      {{$t('lesson.copy.abandoned.retryButton')}}
    </a>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { stopAllAudio } from '@/util/morse/audio'

  /**
   * Displays a confirmation when the user is considered to have abandoned the test. Allows the
   * user to review symbols and then restart the test when ready.
   */

  @Component
  export default class Abandoned extends Vue {
    // eslint-disable-next-line class-methods-use-this
    mounted(): void {
      stopAllAudio()
    }
  }
</script>

<style lang="scss" scoped>
  @use 'src/assets/styles/responsive';

  p {
    @include responsive.bottom-margin-large;
  }

  .button {
    @include responsive.font-size-large;
    display: inline-block;
  }
</style>
