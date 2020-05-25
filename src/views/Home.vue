<template>
  <div id="container">
    <transition name="out-move-up">
      <practice v-if="showPractice" />
      <completed v-else-if="showCompleted" @practice="practice = true" />
      <resume @started="started = true" v-else-if="showResume" />
      <lesson v-else-if="showLesson" />
      <start @started="started = true" v-else />
    </transition>

    <transition appear name="in-fade-3">
      <copyright-info />
    </transition>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Action, Getter } from 'vuex-class'
  import CopyrightInfo from '@/views/Footer.vue'
  import Lesson from '@/views/home/Lesson.vue'
  import Start from '@/views/home/Start.vue'
  import Resume from '@/views/home/Resume.vue'
  import { lastLessonNumber } from '@/data/koch'
  import Completed from '@/views/home/Completed.vue'
  import Practice from '@/views/home/Practice.vue'

  /**
   * The root content container for the application. This Vue manages the transitions between each
   * of the top-level states. Sub-Vues handle rendering for each state.
   */

  @Component({
    components: {
      Practice,
      Completed,
      Resume,
      Start,
      Lesson,
      CopyrightInfo
    }
  })
  export default class Home extends Vue {
    started = false

    practice = false

    @Getter currentLesson!: number

    @Action restore!: () => Promise<boolean>

    get showResume(): boolean {
      return !this.started && this.currentLesson > 0
    }

    get showLesson(): boolean {
      return this.started && this.currentLesson <= lastLessonNumber && !this.practice
    }

    get showPractice(): boolean {
      return this.practice
    }

    get showCompleted(): boolean {
      return this.currentLesson > lastLessonNumber
    }

    mounted(): void {
      this.restore()
    }
  }
</script>

<style lang="scss">
  @use 'src/assets/styles/responsive';

  #container {
    @include responsive.fill-height;

    flex: 0 0 auto;
    max-width: 800px;
    width: 90vw;

    @include responsive.large {
      margin-top: responsive.vh(10);
      min-height: responsive.vh(90);
    }

    @include responsive.small {
      min-height: responsive.vh(100);
    }
  }
</style>

<style lang="scss">
  #container {
    display: flex;
    flex-flow: column nowrap;
  }
</style>

<style lang="scss">
  #container > article {
    flex: 1 1 auto;
  }

  #container > footer {
    flex: 0 0 auto;
  }
</style>
