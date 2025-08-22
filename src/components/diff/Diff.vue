<template>
  <div id="diff" data-testid="diff">
    <div v-for="(change, index) in diff.changes" :key="index" class="diff-character">
      <unchanged v-if="isUnchanged(change)" :change="change" />
      <insertion v-if="isInsertion(change)" :change="change" />
      <deletion v-if="isDeletion(change)" :change="change" />
      <substitution v-if="isSubstitution(change)" :change="change" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  type Diff,
  isDeletion,
  isInsertion,
  isSubstitution,
  isUnchanged
} from '@/util/test/scoring'
import Unchanged from '@/components/diff/Unchanged.vue'
import Insertion from '@/components/diff/Insertion.vue'
import Deletion from '@/components/diff/Deletion.vue'
import Substitution from '@/components/diff/Substitution.vue'

/**
 * Displays a {@link Diff} in a somewhat playful way, using "copy-editing" notation. Individual
 * characters from the diff are rendered with faux-handwritten elision or insertion marks at
 * appropriate places.
 */

defineProps<{ diff: Diff }>()
</script>

<style scoped lang="scss">
@use '@/assets/styles/fonts';
@use '@/assets/styles/responsive';

#diff {
  display: flex;
  flex-flow: row wrap;
}

.diff-character {
  @include fonts.Podkova-Bold;
  flex: 0 0 auto;
  width: 40px;

  @include responsive.font-size-large;

  @include responsive.small {
    width: 30px;
  }
}
</style>

<style lang="scss">
@use '@/assets/styles/responsive';

.correction {
  @include responsive.small {
    width: 80%;
    height: 80%;
  }
}
</style>
