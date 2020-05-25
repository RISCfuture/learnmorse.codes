<template>
  <div id="diff" data-cy="diff">
    <div class="diff-character" v-for="(change, index) in diff.changes" :key="index">
      <unchanged v-if="isUnchanged(change)" :change="change" />
      <insertion v-if="isInsertion(change)" :change="change" />
      <deletion v-if="isDeletion(change)" :change="change" />
      <substitution v-if="isSubstitution(change)" :change="change" />
    </div>
  </div>
</template>

<script lang="ts">
  /* eslint-disable class-methods-use-this */

  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Prop } from 'vue-property-decorator'
  import {
    Change,
    Diff as DiffType,
    isDeletion,
    isInsertion,
    isSubstitution,
    isUnchanged
  } from '@/util/test/scoring'
  import Substitution from '@/components/diff/Substitution.vue'
  import Unchanged from '@/components/diff/Unchanged.vue'
  import Insertion from '@/components/diff/Insertion.vue'
  import Deletion from '@/components/diff/Deletion.vue'

  /**
   * Displays a {@link Diff} in a somewhat playful way, using "copy-editing" notation. Individual
   * characters from the diff are rendered with faux-handwritten elision or insertion marks at
   * appropriate places.
   */

  @Component({
    components: {
     Deletion, Insertion, Unchanged, Substitution
    }
  })
  export default class Diff extends Vue {
    /** The diff to render. */
    @Prop({ type: Object, required: true }) diff!: DiffType

    isUnchanged(change: Change): boolean { return isUnchanged(change) }

    isInsertion(change: Change): boolean { return isInsertion(change) }

    isDeletion(change: Change): boolean { return isDeletion(change) }

    isSubstitution(change: Change): boolean { return isSubstitution(change) }
  }
</script>

<style scoped lang="scss">
  @use 'src/assets/styles/fonts';
  @use 'src/assets/styles/responsive';

  #diff {
    display: flex;
    flex-flow: row wrap;
  }

  .diff-character {
    @include fonts.Podkova-Bold;
    @include responsive.font-size-large;

    flex: 0 0 auto;
    width: 40px;
    @include responsive.small { width: 30px; }
  }
</style>

<style lang="scss">
  @use 'src/assets/styles/responsive';

  .correction {
    @include responsive.small {
      height: 80%;
      width: 80%;
    }
  }
</style>
