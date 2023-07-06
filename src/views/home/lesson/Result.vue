<template>
  <div>
    <p
      id="score"
      :class="{ pass, perfect }"
      data-cy="score"
    >
      {{ score }}
    </p>
    <p
      v-if="pass && extraCredit"
      data-cy="extraCredit"
    >
      {{ extraCreditString }}
    </p>

    <diff
      v-if="showDiff"
      :diff="diff"
    />
    <tip v-else-if="showTip" />
    <platitude
      v-else
      :pass="pass"
    />

    <div
      id="confetti-source"
      ref="confettiSource"
    />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Prop, Watch } from 'vue-property-decorator'
  import { confetti } from 'dom-confetti'
  import { clamp, random } from 'lodash-es'
  import { Diff, extraCredit, isPass } from '@/util/test/scoring'
  import Platitude from '@/views/home/lesson/result/Platitude.vue'
  import Tip from '@/views/home/lesson/result/Tip.vue'
  import DiffComponent from '@/components/diff/Diff.vue'

  /**
   * Displays the user's results following a test, including a tip or a platitude.
   * Spouts confetti for a 100% score.
   *
   * For tests as part of a {@link Practice} (and not a {@link Lesson}), also displays the
   * {@link Diff}.
   */

  @Component({
    components: { Diff: DiffComponent, Tip, Platitude }
  })
  export default class Result extends Vue {
    readonly $refs!: {
      confettiSource: HTMLDivElement
    }

    @Prop({ type: Number, required: true }) penalty!: number

    @Prop({ type: Object, required: true }) diff!: Diff

    @Prop({ type: Boolean, default: false }) showDiff!: boolean

    showTip = false

    get score(): string {
      const clampedScore = clamp(this.penalty, 0.0, 1.0)
      return this.$n(1 - clampedScore, 'percent')
    }

    get pass(): boolean {
      return isPass(this.penalty)
    }

    get perfect(): boolean {
      return this.penalty <= 0.0
    }

    get extraCredit(): number {
      return extraCredit(this.diff)
    }

    get extraCreditString(): string {
      return <string> this.$tc(
        'lesson.copy.extraCredit',
        this.extraCredit,
        { points: this.$n(this.extraCredit, 'integer') }
      )
    }

    mounted(): void {
      this.refresh()
    }

    @Watch('diff')
    private onDiffChanged() {
      this.refresh()
    }

    private refresh() {
      this.showTip = (random(10) === 0)
      if (this.perfect) confetti(this.$refs.confettiSource)
    }
  }
</script>

<style lang="scss" scoped>
  @use "src/assets/styles/colors";
  @use "src/assets/styles/fonts";
  @use "src/assets/styles/responsive";

  #score {
    @include fonts.Kreon-Black;
    @include responsive.font-size-huge;

    margin: 0;
    padding: 0;

    &.pass:not(.perfect) {
      @include colors.theme using ($theme) {
        color: colors.get($theme, "pass");
      }
    }

    &.perfect {
      background:
        linear-gradient(
          135deg,
          #a864fd 0%,
          #29cdff 25%,
          #78ff44 50%,
          #ff718d 75%,
          #fdff6a 100%
        );
      -webkit-background-clip: text;
      display: inline-block;
      -webkit-text-fill-color: transparent;
    }
  }

  #confetti-source {
    height: 1px;
    left: 50vw;
    position: fixed;
    top: 50vh;
    width: 1px;
  }
</style>
