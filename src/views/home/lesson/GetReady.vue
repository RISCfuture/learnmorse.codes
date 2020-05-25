<template>
  <p data-cy="getReady">{{$t('lesson.copy.getReady')}}</p>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'

  /**
   * Displays the "Get ready!" message when the test is beginning.
   */

  @Component
  export default class GetReady extends Vue {
  }
</script>

<style scoped lang="scss">
  @use 'src/assets/styles/colors';
  @use 'src/assets/styles/responsive';

  p {
    @include responsive.font-size-large;
    @include colors.muted;
  }
</style>
