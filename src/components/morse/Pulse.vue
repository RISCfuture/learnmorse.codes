<template>
  <svg height="10" :width="widthPixels" xmlns="http://www.w3.org/2000/svg">
    <path :d="path" :class="colorClass" fill-rule="evenodd" />
  </svg>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Prop } from 'vue-property-decorator'

  @Component
  export default class Pulse extends Vue {
    @Prop({ type: String, default: 'transparent' }) color!: string

    @Prop({ type: Number, default: 1 }) width!: number

    get widthPixels(): number { return this.width * 10 }

    get colorClass(): string { return `color-${this.color}` }

    get path(): string {
      return `M0 0h${this.widthPixels}v10H0z`
    }
  }
</script>

<style scoped lang="scss">
  @use "src/assets/styles/colors";

  .color-text {
    @include colors.theme using ($theme) {
      fill: colors.get($theme, "text-color");
    }
  }

  .color-transparent {
    fill: transparent;
  }
</style>
