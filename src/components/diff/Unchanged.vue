<template>
  <div>
    <p class="symbol">
      {{ change.unchanged | symbol }}
    </p>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Prop } from 'vue-property-decorator'
  import { Unchanged as UnchangedChange } from '@/util/test/scoring'

  @Component
  export default class Unchanged extends Vue {
    @Prop({ type: Object, required: true }) change!: UnchangedChange
  }
</script>

<style scoped lang="scss">
  @use "src/assets/styles/colors";

  p {
    @include colors.theme using ($theme) {
      color: colors.get($theme, "pass");
    }
  }
</style>
