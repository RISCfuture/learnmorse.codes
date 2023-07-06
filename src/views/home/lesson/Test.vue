<template>
  <div class="test-symbols">
    <transition
      appear
      mode="out-in"
      name="in-grow-out-grow-linear"
    >
      <start-typing
        v-if="startTyping"
        key="startTyping"
      />
      <test-field
        v-else
        key="test"
        :lesson="lesson"
        @abandon="$emit('abandon')"
        @finished="onFinished($event)"
        @finishing="onFinishing"
      />
    </transition>

    <transition
      appear
      name="in-grow-out-fade"
    >
      <pencils-down v-if="pencilsDown" />
    </transition>
  </div>
</template>

<script lang="ts">
  import Component, { mixins } from 'vue-class-component'
  import { Prop, Watch } from 'vue-property-decorator'
  import TestField from '@/views/home/lesson/test/Field.vue'
  import { delayBeforeScoring, delayBeforeTyping } from '@/components/animation'
  import PencilsDown from '@/views/home/lesson/test/PencilsDown.vue'
  import { Diff } from '@/util/test/scoring'
  import StartTyping from '@/views/home/lesson/test/StartTyping.vue'
  import Timers from '@/mixins/timers'
  import { stopAllAudio } from '@/util/morse/audio'
  import { isMobile } from '@/util/etc'

  /**
   * Runs the test portion of the lesson flow. Displays the "Start typing!" prompt, then shows the
   * test field. Displays the "Pencils down" prompt as the test finishes.
   */

  @Component({
    components: {
      StartTyping, PencilsDown, TestField
    }
  })
  export default class Test extends mixins(Timers) {
    @Prop({ type: Number, required: true }) lesson!: number

    startTyping = !isMobile

    pencilsDown = false

    mounted(): void {
      this.reset()
    }

    onFinishing(): void {
      this.cancelTimers()
      this.pencilsDown = true
      this.addTimer(delayBeforeScoring, () => {
        this.pencilsDown = false
      })
    }

    onFinished({ diff, penalty }: { diff: Diff, penalty: number }): void {
      stopAllAudio()
      this.$emit('finished', { diff, penalty })
    }

    @Watch('lesson')
    private onLessonChanged() {
      this.reset()
    }

    private reset() {
      this.cancelTimers()
      this.startTyping = !isMobile
      this.addTimer(delayBeforeTyping, () => {
        this.startTyping = false
      })
    }
  }
</script>
