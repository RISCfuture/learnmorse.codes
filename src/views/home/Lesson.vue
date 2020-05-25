<template>
  <div id="lesson">
    <learn :audio="symbolGuidePlaysAudio"
           :interactive="symbolGuideIsInteractive"
           :lesson="currentLesson"
           @finished="readyToTest"
           ref="learnSymbols" />

    <transition appear mode="out-in" name="in-fade-out-fade">
      <result :diff="diff" :penalty="penalty" key="scoring" v-if="isScoring" />

      <get-ready key="starting" v-else-if="isStarting" />

      <abandoned @retry="readyToTest" key="abandoned" v-else-if="isAbandoned" />

      <test :lesson="currentLesson"
            @abandon="onAbandoned"
            @finished="onTestingFinished($event)"
            key="testing"
            v-else-if="isTesting" />

    </transition>
  </div>
</template>

<script lang="ts">
  import Component, { mixins } from 'vue-class-component'
  import { Action, Getter } from 'vuex-class'
  import { Watch } from 'vue-property-decorator'
  import { isNull } from 'lodash-es'
  import Learn from '@/views/home/lesson/Learn.vue'
  import Test from '@/views/home/lesson/Test.vue'
  import Result from '@/views/home/lesson/Result.vue'
  import {
    Diff, isInsertion, isPass, isSubstitution
  } from '@/util/test/scoring'
  import GetReady from '@/views/home/lesson/GetReady.vue'
  import { delayAfterScoring, delayBeforeStarting } from '@/components/animation'
  import { newSymbolsInLesson } from '@/data/koch'
  import Timers from '@/mixins/timers'
  import Abandoned from '@/views/home/lesson/Abandoned.vue'
  import { isMobile } from '@/util/etc'

  enum State {
    LEARNING,
    STARTING,
    TESTING,
    SCORING,
    ABANDONED
  }

  /**
   * Displays the Lesson view, which handles all of the following:
   *
   * * demonstrating new symbols to the user,
   * * testing the user with a Morse code sequence,
   * * presenting the user their score,
   * * advancing or re-testing as appropriate,
   * * and handling abandoned tests.
   *
   * Each of these states is handled by a specific sub-Vue. This view mostly manages the transition
   * between each of these states.
   *
   * Because the {@link Test} view must display its own "Start Test" button on mobile devices, the
   * _starting_ state is skipped on mobile devices. After the learning portion is complete on
   * mobile, the view proceeds directly to the _testing_ state, where the "Start Test" button is
   * shown.
   */

  @Component({
    components: {
      Abandoned,
      GetReady,
      Result,
      Test,
      Learn
    }
  })
  export default class Lesson extends mixins(Timers) {
    $refs!: {
      learnSymbols: Learn
    }

    state: State = State.LEARNING

    diff: Diff | null = null

    penalty: number | null = null

    @Getter currentLesson!: number

    @Action incrementLesson!: () => Promise<void>

    @Action decrementLesson!: () => Promise<void>

    @Action storeSuccess!: (args: { lesson: number }) => Promise<void>

    get isLearning(): boolean {
      return this.state === State.LEARNING
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

    get isAbandoned(): boolean {
      return this.state === State.ABANDONED
    }

    get symbolGuideIsInteractive(): boolean {
      return this.state !== State.LEARNING
    }

    get symbolGuidePlaysAudio(): boolean {
      return this.state !== State.TESTING
    }

    readyToTest(): void {
      this.state = isMobile ? State.TESTING : State.STARTING
    }

    startTest(): void {
      this.state = State.TESTING
    }

    created(): void {
      window.addEventListener('keyup', this.onKeyPress)
    }

    mounted(): void {
      this.newLesson()
    }

    beforeDestroy(): void {
      window.removeEventListener('keyup', this.onKeyPress)
    }

    onKeyPress(event: KeyboardEvent): void {
      if (event.target instanceof HTMLInputElement) return

      // eslint-disable-next-line default-case
      switch (event.key) {
        case 'ArrowLeft':
          this.decrementLesson()
          break
        case 'ArrowRight':
          this.incrementLesson()
          break
      }
    }

    onTestingFinished({ diff, penalty }: { diff: Diff, penalty: number }): void {
      this.state = State.SCORING
      this.diff = diff
      this.penalty = penalty
    }

    onAbandoned(): void {
      if (this.state === State.TESTING) this.state = State.ABANDONED
    }

    @Watch('state')
    private onStateChange() {
      if (this.state === State.STARTING) {
        this.addTimer(delayBeforeStarting, () => this.startTest())
      } else if (this.state === State.SCORING) {
        this.addTimer(delayAfterScoring, () => this.acceptResult())
      }
    }

    @Watch('penalty')
    private onPenaltyChange() {
      if (!isNull(this.penalty) && isPass(this.penalty)) {
        this.storeSuccess({ lesson: this.currentLesson })
      }
    }

    @Watch('currentLesson')
    private currentLessonChanged() {
      this.newLesson()
    }

    private acceptResult() {
      if (isNull(this.penalty)) this.state = State.LEARNING
      else if (isPass(this.penalty)) this.incrementLesson()
      else this.repeatLesson()
    }

    private newLesson() {
      this.cancelTimers()
      this.state = State.LEARNING
      this.demoNewSymbols()
    }

    private repeatLesson() {
      this.state = State.LEARNING
      this.demoMissedSymbols()
    }

    private demoNewSymbols() {
      const symbols = newSymbolsInLesson(this.currentLesson)
      this.$refs.learnSymbols.demonstrateSymbols(symbols)
    }

    private demoMissedSymbols() {
      if (!this.diff) return

      const missedSymbols = new Set<string>()
      this.diff.changes.forEach(c => {
        if (isInsertion(c)) missedSymbols.add(c.add)
        if (isSubstitution(c)) {
          missedSymbols.add(c.replace)
          missedSymbols.add(c.with)
        }
      })

      this.$refs.learnSymbols.demonstrateSymbols([...missedSymbols])
    }
  }
</script>
