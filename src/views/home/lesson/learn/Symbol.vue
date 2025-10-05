<template>
  <div
    ref="root"
    :class="{ hover }"
    :data-testid="testId"
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

<script setup lang="ts">
import MorseCode from '@/components/morse/MorseCode.vue'
import { computed, ref, watch } from 'vue'
import useTimers from '@/mixins/timers'
import MorseCodeAudio from '@/util/morse/audio'
import { isUndefined } from 'lodash-es'
import { delayAroundAudio } from '@/components/animation'
import inView from '@/util/inView'

/**
 * Displays a symbol. Hovering over the symbol reveals its Morse code as a pictograph, and plays
 * the audio for that symbol. Depending on the state of the lesson, either of these two hover
 * behaviors may be suppressed.
 *
 * You can programmatically simulate this hover behavior by calling {@link demonstrate}, which
 * will also scroll the symbol into view if necessary.
 */

const { cancelTimers, addTimer } = useTimers()

const props = withDefaults(
  defineProps<{
    symbol: string
    interactive: boolean
    audio: boolean
  }>(),
  {
    interactive: true,
    audio: true
  }
)

const mouseHover = ref(false)
const codeHover = ref(false)
const root = ref<HTMLDivElement | null>(null)

const testId = computed(() => `symbolKey-${props.symbol}`)
const hover = computed(() => (mouseHover.value && props.interactive) || codeHover.value)
const displaySymbol = computed(() => {
  if (isUndefined(props.symbol)) return ''
  return props.symbol.toLocaleUpperCase()
})
const audioGenerator = computed(() => new MorseCodeAudio(displaySymbol.value))

/**
 * The amount of time (in seconds) that the {@link demonstrate} animation and audio will take.
 */
const demoDuration = computed(() => (audioGenerator.value.duration + delayAroundAudio * 2) * 1000)

/**
 * Highlights the symbol, displays its Morse code pictograph, and plays the Morse code audio.
 * Scrolls the symbol into view if it is off-screen.
 *
 * @param smooth Whether to use smooth scrolling.
 */
async function demonstrate(smooth = false) {
  if (codeHover.value) return
  codeHover.value = true

  await scrollIntoView(smooth)

  cancelTimers()

  if (props.audio) {
    addTimer(delayAroundAudio, () => {
      audioGenerator.value.play(delayAroundAudio)
    })
  }
  addTimer(demoDuration.value, () => {
    codeHover.value = false
  })
}

watch(mouseHover, (hover) => {
  if (hover && props.interactive) demonstrate()
})

function scrollIntoView(smooth: boolean): Promise<void> {
  return new Promise((resolve) => {
    if (!root.value || inView(root.value)) {
      resolve()
      return
    }

    const intersectionObserver = new IntersectionObserver(([el]) => {
      if (el?.isIntersecting) {
        intersectionObserver.disconnect()
        resolve()
      }
    })

    intersectionObserver.observe(root.value)
    root.value.scrollIntoView({
      inline: 'center',
      behavior: smooth ? 'smooth' : 'auto'
    })
  })
}

defineExpose({ demoDuration, demonstrate, symbol: props.symbol })
</script>

<style scoped lang="scss">
@use '@/assets/styles/fonts';
@use '@/assets/styles/responsive';

p {
  @include fonts.Podkova-SemiBold;
  transition: transform 0.5s;

  @include responsive.font-size-very-large;
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

.learn-symbol.hover .morse-code {
  opacity: 1;
}
</style>
