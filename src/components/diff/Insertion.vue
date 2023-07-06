<template>
  <div>
    <p class="symbol">
      {{ change.add | symbol }}
    </p>
    <img
      class="correction"
      src="@/assets/images/Insert.svg"
      :alt="$t('lesson.practice.insert')"
    >
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Prop } from 'vue-property-decorator'
  import { Insertion as InsertionChange } from '@/util/test/scoring'

  @Component
  export default class Insertion extends Vue {
    @Prop({ type: Object, required: true }) change!: InsertionChange
  }
</script>

<style scoped lang="scss">
  @use "src/assets/styles/colors";
  @use "src/assets/styles/responsive";

  div {
    position: relative;
  }

  // p {
  //   @include colors.theme using ($theme) {
  //     color: colors.get($theme, 'fail')
  //   }
  // }

  img {
    bottom: -15px;
    display: block;
    left: 10px;
    position: absolute;

    @include responsive.small {
      bottom: -10px;
      height: 50%;
      left: 10px;
      width: 50%;
    }
  }
</style>
