<template>
  <div>
    <p class="symbol">{{change.remove | symbol}}</p>
    <img class="correction" src="@/assets/images/Elide.svg" />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Prop } from 'vue-property-decorator'
  import { Deletion as DeletionChange } from '@/util/test/scoring'

  @Component
  export default class Deletion extends Vue {
    @Prop({ type: Object, required: true }) change!: DeletionChange
  }
</script>

<style scoped lang="scss">
  div {
    position: relative;
  }

  img {
    display: block;
    left: 0;
    position: absolute;
    top: 0;
  }
</style>
