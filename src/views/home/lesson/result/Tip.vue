<template>
  <p>{{ tip }}</p>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { sample } from 'lodash-es'

  /**
   * Displays a tip to help the user learn. Tips are displayed occasionally in place of
   * {@link Platitude}s.
   */

  @Component
  export default class Tip extends Vue {
    get tip(): string {
      return sample(<string[]> <unknown> this.$t('lesson.tips'))!
    }
  }
</script>

<style scoped lang="scss">
  @use "src/assets/styles/colors";
  @use "src/assets/styles/responsive";

  p {
    @include responsive.top-margin-large;
    @include colors.muted;
  }
</style>
