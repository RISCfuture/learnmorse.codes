<template>
  <div>
    <p class="symbol">{{change.replace | symbol}}</p>
    <p class="replacement">{{change.with | symbol}}</p>
    <img class="correction" src="@/assets/images/Elide.svg" />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Prop } from 'vue-property-decorator'
  import { Replacement } from '@/util/test/scoring'

  @Component
  export default class Substitution extends Vue {
    @Prop({ type: Object, required: true }) change!: Replacement
  }
</script>

<style scoped lang="scss">
  @use 'src/assets/styles/responsive';

  div {
    position: relative;
  }

  img {
    display: block;
    left: 5px;
    position: absolute;
    top: 0;
  }

  .replacement {

    color: #f00;
    margin: 0;
    padding: 0;
    position: absolute;
    right: -15px;
    top: -30px;

    @include responsive.small {
      right: -5px;
      top: -20px;
    }
  }
</style>
