<template>
  <div
    :class="{ hover }"
    :data-cy="dataCy"
    class="learn-symbol"
    @mouseleave="mouseHover = false"
    @focusout="mouseHover = false"
    @mouseover="mouseHover = true"
    @focusin="mouseHover = true"
  >
    <p>{{ displaySymbol }}</p>
    <morse-code :text="symbol" />
  </div>
</template>

<script lang="ts">
  import Component, { mixins } from 'vue-class-component'
  import { Prop, Watch } from 'vue-property-decorator'
  import inView from 'element-in-view'
  import { isUndefined } from 'lodash-es'
  import MorseCode from '@/components/morse/MorseCode.vue'
  import MorseCodeAudio from '@/util/morse/audio'
  import { delayAroundAudio } from '@/components/animation'
  import Timers from '@/mixins/timers'

  /**
   * Displays a symbol. Hovering over the symbol reveals its Morse code as a pictograph, and plays
   * the audio for that symbol. Depending on the state of the lesson, either of these two hover
   * behaviors may be suppressed.
   *
   * You can programmatically simulate this hover behavior by calling {@link demonstrate}, which
   * will also scroll the symbol into view if necessary.
   */

  @Component({
    components: { MorseCode }
  })
  export default class SymbolKey extends mixins(Timers) {
    $el!: HTMLDivElement

    @Prop({ type: String, required: true }) symbol!: string

    @Prop({ type: Boolean, default: true }) interactive!: boolean

    @Prop({ type: Boolean, default: true }) audio!: boolean

    mouseHover = false

    private codeHover = false

    private audioGenerator = new MorseCodeAudio(this.displaySymbol)

    get dataCy(): string { return `symbolKey-${this.symbol}` }

    get hover(): boolean { return (this.mouseHover && this.interactive) || this.codeHover }

    get displaySymbol(): string {
      if (isUndefined(this.symbol)) return ''
      return this.symbol.toLocaleUpperCase()
    }

    /**
     * The amount of time (in seconds) that the {@link demonstrate} animation and audio will take.
     */
    get demoDuration(): number {
      return (this.audioGenerator.duration + delayAroundAudio * 2) * 1000
    }

    /**
     * Highlights the symbol, displays its Morse code pictograph, and plays the Morse code audio.
     * Scrolls the symbol into view if it is off-screen.
     *
     * @param smooth Whether to use smooth scrolling.
     */

    async demonstrate(smooth = false): Promise<void> {
      if (this.codeHover) return
      this.codeHover = true

      await this.scrollIntoView(smooth)

      this.cancelTimers()

      if (this.audio) {
        this.addTimer(delayAroundAudio, () => {
          this.audioGenerator.play(delayAroundAudio)
        })
      }
      this.addTimer(this.demoDuration, () => {
        this.codeHover = false
      })
    }

    mounted(): void { this.audioGenerator = new MorseCodeAudio(this.displaySymbol) }

    private scrollIntoView(smooth: boolean): Promise<void> {
      return new Promise(resolve => {
        if (inView(this.$el, { threshold: 1 })) {
          resolve()
          return
        }

        const intersectionObserver = new IntersectionObserver(([el]) => {
          if (el.isIntersecting) {
            intersectionObserver.disconnect()
            resolve()
          }
        })

        intersectionObserver.observe(this.$el)
        this.$el.scrollIntoView({ inline: 'center', behavior: smooth ? 'smooth' : 'auto' })
      })
    }

    @Watch('mouseHover')
    private onMouseHoverChange() {
      if (this.mouseHover && this.interactive) this.demonstrate()
    }
  }
</script>

<style scoped lang="scss">
  @use "src/assets/styles/fonts";
  @use "src/assets/styles/responsive";

  p {
    @include fonts.Podkova-SemiBold;
    @include responsive.font-size-very-large;

    transition: transform 0.5s;
  }

  .learn-symbol {
    @include responsive.bottom-margin-large;

    &.hover p {
      transform: scale(2);
    }
  }
</style>

<style lang="scss">
  .morse-code {
    opacity: 0;
    transition: opacity 0.5s;
  }

  .learn-symbol.hover .morse-code { opacity: 1; }
</style>
