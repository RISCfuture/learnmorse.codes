<template>
  <p>{{ platitude }}</p>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Prop } from 'vue-property-decorator'
  import { LocaleMessageArray } from 'vue-i18n'
  import { sample } from 'lodash-es'

  /**
   * Displays an encouraging message to the user if they failed the test, or an affirming message if
   * they succeeded.
   */

  @Component
  export default class Platitude extends Vue {
    @Prop({ type: Boolean, required: true }) pass!: boolean

    get platitude(): string {
      const path = `lesson.platitudes.${this.pass ? 'congratulations' : 'encouragement'}`
      const strings = <string[]><LocaleMessageArray> this.$t(path)
      return sample(strings)!
    }
  }
</script>

<style scoped lang="scss">
  @use "src/assets/styles/colors";
  @use "src/assets/styles/responsive";

  p {
    @include responsive.font-size-large;
  }
</style>
