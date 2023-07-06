<template>
  <div id="practice">
    <transition
      appear
      mode="out-in"
      name="in-fade-out-fade"
    >
      <get-ready
        v-if="isStarting"
        key="starting"
      />

      <test
        v-else-if="isTesting"
        key="testing"
        :lesson="lesson"
        @finished="onTestingFinished($event)"
      />

      <result
        v-else-if="isScoring"
        key="scoring"
        :diff="diff"
        :penalty="penalty"
        :show-diff="true"
      />
    </transition>
  </div>
</template>

<script lang="ts">
  import Component, { mixins } from 'vue-class-component'
  import { Watch } from 'vue-property-decorator'
  import GetReady from '@/views/home/lesson/GetReady.vue'
  import Result from '@/views/home/lesson/Result.vue'
  import Test from '@/views/home/lesson/Test.vue'
  import { Diff } from '@/util/test/scoring'
  import { delayAfterScoring, delayBeforeStarting } from '@/components/animation'
  import Timers from '@/mixins/timers'
  import { lastLessonNumber } from '@/data/koch'
  import { isMobile } from '@/util/etc'

  enum State {
    STARTING,
    TESTING,
    SCORING
  }

  /**
   * This view allows a user who has completed all lessons to continue to test him/herself. Very
   * similar to the {@link Lesson} view without the "learning" portion and without lesson
   * advancement (only alternates between {@link Test} and {@link Result}).
   *
   * Because the {@link Test} view must display its own "Start Test" button on mobile devices, the
   * _starting_ state is skipped on mobile devices. After the learning portion is complete on
   * mobile, the view proceeds directly to the _testing_ state, where the "Start Test" button is
   * shown.
   */

  @Component({
    components: {
      GetReady, Result, Test
    }
  })
  export default class Practice extends mixins(Timers) {
    state: State = isMobile ? State.TESTING : State.STARTING

    diff: Diff | null = null

    penalty: number | null = null

    get lesson(): number {
      return lastLessonNumber
    }

    get isStarting(): boolean {
      return this.state === State.STARTING
    }

    get isTesting(): boolean {
      return this.state === State.TESTING
    }

    get isScoring(): boolean {
      return this.state === State.SCORING
    }

    startTest(): void {
      this.state = State.TESTING
      this.onStateChange()
    }

    onTestingFinished({ diff, penalty }: { diff: Diff, penalty: number }): void {
      this.state = State.SCORING
      this.diff = diff
      this.penalty = penalty
    }

    mounted(): void {
      this.onStateChange()
    }

    @Watch('state')
    private onStateChange() {
      if (this.state === State.STARTING) {
        this.addTimer(delayBeforeStarting, () => {
          this.state = State.TESTING
        })
      } else if (this.state === State.SCORING) {
        this.addTimer(delayAfterScoring, () => {
          this.state = isMobile ? State.TESTING : State.STARTING
        })
      }
    }
  }
</script>

<style lang="scss">
  @use "src/assets/styles/responsive";

  #practice #test {
    @include responsive.top-margin-large;
  }
</style>
