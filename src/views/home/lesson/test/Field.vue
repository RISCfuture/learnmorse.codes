<template>
  <div id="test">
    <a @click.prevent="startOnMobile"
       class="button"
       v-if="!startedOnMobile">
      {{$t('lesson.copy.getReadyButton')}}
    </a>

    <input @keydown.passive="onActivity"
           autocapitalize="off"
           autocomplete="off"
           autocorrect="off"
           data-cy="testInput"
           id="test-input"
           ref="testInput"
           spellcheck="false"
           type="text"
           :class="{started: startedOnMobile}"
           v-model="testInput" />

    <input :value="answer" data-cy="answerKey" type="hidden" />
  </div>
</template>

<script lang="ts">
  import Component, { mixins } from 'vue-class-component'
  import { Prop, Watch } from 'vue-property-decorator'
  import { isNull } from 'lodash-es'
  import MorseCodeAudio from '@/util/morse/audio'
  import {
    delayAroundAudio,
    delayBeforeAbandoned,
    delayBeforeScoring,
    delayBeforeTyping
  } from '@/components/animation'
  import { calculateDiff, scoreLossForAnswer } from '@/util/test/scoring'
  import Timers from '@/mixins/timers'
  import generateAnswer from '@/util/test/generation'
  import { isMobile } from '@/util/etc'

  /**
   * Displays the input field for the test. This view also handles tracking test abandonment. This
   * view implements two different behaviors depending on whether the user is on mobile or on a
   * desktop browser.
   *
   * On desktop, the text field is immediately displayed and focus is moved to the text field
   * automatically. The test begins when the view is instantiated.
   *
   * Mobile devices generally don't allow focus to be moved without explicit user input. So, the
   * text field is hidden, and a "Start test" button is shown. When the button is clicked, focus
   * is transferred to the text field, the button is hidden, and the test begins.
   */

  @Component
  export default class TestField extends mixins(Timers) {
    $refs!: {
      testInput: HTMLInputElement
    }

    @Prop({ type: Number, required: true }) lesson!: number

    answer = ''

    testInput = ''

    activityTimer: number | null = null

    startedOnMobile = !isMobile

    mounted(): void {
      this.reset()

      document.addEventListener('focus', this.updateStartedOnMobile)
    }

    beforeDestroy(): void {
      document.removeEventListener('focus', this.updateStartedOnMobile)
    }

    updateStartedOnMobile(): void {
      this.startedOnMobile = document.activeElement === this.$refs.testInput
    }

    onActivity(event?: KeyboardEvent): void {
      if (isMobile && !this.startedOnMobile) return
      if (event?.key === 'Enter') this.finishTest()

      if (!isNull(this.activityTimer)) clearTimeout(this.activityTimer)
      this.activityTimer = setTimeout(() => this.$emit('abandon'), delayBeforeAbandoned)
    }

    startOnMobile(): void {
      this.$refs.testInput.focus()
      this.startedOnMobile = true
      this.onActivity()
      this.startTest()
    }

    @Watch('lesson')
    private onLessonChanged() {
      this.reset()
    }

    private reset() {
      this.cancelTimers()
      if (!isMobile) this.addTimer(delayBeforeTyping, () => this.startTest())

      if (!isNull(this.activityTimer)) {
        clearTimeout(this.activityTimer)
        this.activityTimer = null
      }

      this.answer = generateAnswer(this.lesson)
      console.log(this.answer)

      this.onActivity()

      this.testInput = ''
      this.$refs.testInput.focus()
    }

    private startTest() {
      const audio = new MorseCodeAudio(this.answer)
      audio.play(delayAroundAudio)

      this.addTimer((audio.duration + delayAroundAudio * 2) * 1000, () => {
        this.finishTest()
      })
    }

    private finishTest() {
      this.$emit('finishing')
      this.addTimer(delayBeforeScoring, () => this.scoreTest())
    }

    private scoreTest() {
      const diff = calculateDiff(this.answer, this.testInput)
      const penalty = scoreLossForAnswer(this.answer, diff)
      this.$emit('finished', { diff, penalty })
    }
  }
</script>

<style lang="scss" scoped>
  @use 'src/assets/styles/colors';
  @use 'src/assets/styles/responsive';

  #test-input {
    @include responsive.font-size-very-large;
    @include colors.muted;

    &:not(.started) {
      opacity: 0;
    }
  }
</style>
