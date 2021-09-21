<template>
  <div data-cy="completed">
    <h1>{{$t('completed.header')}}</h1>
    <p>{{$t('completed.body')}}</p>

    <div id="buttons">
      <a href="#" @click.prevent="resetLesson" class="button" data-cy="resetButton">
        {{$t('completed.resetButton')}}
      </a>
      <a href="#" @click.prevent="practiceMode" class="button" data-cy="practiceButton">
        {{$t('completed.practiceButton')}}
      </a>
    </div>

    <div class="confetti" id="confetti-1" ref="confetti1" />
    <div class="confetti" id="confetti-2" ref="confetti2" />
    <div class="confetti" id="confetti-3" ref="confetti3" />
  </div>
</template>

<script lang="ts">
  import Component, { mixins } from 'vue-class-component'
  import { Action } from 'vuex-class'
  import { confetti } from 'dom-confetti'
  import Timers from '@/mixins/timers'
  import { sharedAudioContext } from '@/util/morse/audio'

  /**
   * Displays the "Completed" page, shown when a user completes all tests in the syllabus. Shoots
   * three confetti bursts from three different parts of the page. Gives the user the option to
   * either restart their progress or continue to practice transcribing Morse code.
   */

  @Component
  export default class Completed extends mixins(Timers) {
    readonly $refs!: {
      confetti1: HTMLDivElement
      confetti2: HTMLDivElement
      confetti3: HTMLDivElement
    }

    @Action resetLesson!: () => Promise<void>

    mounted(): void {
      this.addTimer(500, () => confetti(this.$refs.confetti1))
      this.addTimer(800, () => confetti(this.$refs.confetti2))
      this.addTimer(1600, () => confetti(this.$refs.confetti3))
    }

    practiceMode(): void {
      sharedAudioContext().resume()
      this.$emit('practice')
    }
  }
</script>

<style lang="scss" scoped>
  @use "src/assets/styles/responsive";

  h1 {
    @include responsive.font-size-very-large;

    font-weight: 700;
  }

  p {
    @include responsive.bottom-margin-large;
    @include responsive.font-size-regular;
  }

  #buttons {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;

    a {
      @include responsive.font-size-regular;
    }
  }

  .confetti {
    height: 1px;
    position: fixed;
    width: 1px;
  }

  #confetti-1 {
    left: 20vw;
    top: responsive.vh(50);
  }

  #confetti-2 {
    left: 80vw;
    top: responsive.vh(70);
  }

  #confetti-3 {
    left: 50vw;
    top: responsive.vh(90);
  }
</style>
