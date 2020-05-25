<template>
  <p data-cy="pencilsDown">{{$t('lesson.copy.grading')}}</p>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'

  /**
   * Displays the "Pencils down!" warning when the test is ending.
   */

  @Component
  export default class PencilsDown extends Vue {
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
