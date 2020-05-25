<template>
  <p data-cy="startTyping">{{$t('lesson.copy.startTyping')}}</p>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'

  /**
   * Displays the "Start typing!" warning when the test is about to begin.
   */

  @Component
  export default class StartTyping extends Vue {
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
