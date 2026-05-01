<template>
  <div id="learn-symbols" ref="root" :class="{ overflowing }">
    <symbol-view
      v-for="symbol in symbols"
      :key="symbol"
      ref="symbolElements"
      :audio="props.audio"
      :interactive="props.interactive"
      :symbol="symbol"
    />
  </div>
</template>

<script setup lang="ts">
import SymbolView from '@/views/home/lesson/learn/Symbol.vue'
import { computed, ref, watchEffect } from 'vue'
import { symbolsInLesson } from '@/data/koch'
import { useTimeoutFn } from '@vueuse/core'

/**
 * Handles the "learning" portion of a lesson. Displays all of the symbols covered so far in a
 * row. Can highlight new or missed symbols to the user with {@link demonstrateSymbols}.
 */

const activeTimers: { stop: () => void }[] = []

function scheduleTimer(delay: number, action: () => void) {
  activeTimers.push(useTimeoutFn(action, delay))
}

function cancelTimers() {
  while (activeTimers.length > 0) activeTimers.pop()?.stop()
}

const emit = defineEmits<{
  finished: []
}>()

interface SymbolElement {
  symbol: string
  demoDuration: number
  demonstrate: (smooth: boolean) => Promise<void>
}

const symbolElements = ref<SymbolElement[]>([])
const root = ref<HTMLDivElement | null>(null)

const props = withDefaults(
  defineProps<{
    lesson: number
    interactive: boolean
    audio: boolean
  }>(),
  {
    interactive: true,
    audio: true,
  },
)

const overflowing = ref(false)

const symbols = computed(() => symbolsInLesson(props.lesson))

watchEffect(() => {
  if (!root.value) return
  overflowing.value = root.value.scrollWidth > root.value.clientWidth
})

/**
 * Call this method to highlight one or more symbols to the user in succession.
 *
 * @param symbols The symbols to highlight.
 */

function demonstrateSymbols(symbols: string[]) {
  if (symbols.length === 0) return

  cancelTimers()
  const symbolSet = new Set(symbols)

  // 1/2 second after we load...
  scheduleTimer(500, () => {
    let time = 0
    let firstSymbol = true
    symbolElements.value.forEach((element) => {
      if (!symbolSet.has(element.symbol)) return

      // ... highlight a letter ...
      if (firstSymbol) {
        scheduleTimer(time, () => {
          void element.demonstrate(false)
        })
      } else {
        scheduleTimer(time, () => {
          void element.demonstrate(true)
        })
      }
      // ... then wait another 1/2 second for the next letter ...
      time = time + element.demoDuration + 1500

      firstSymbol = false
    })

    // ... then wait a full second before telling the parent we're done with the demo
    scheduleTimer(time + 500, () => {
      emit('finished')
    })
  })
}

defineExpose({ demonstrateSymbols })
</script>

<style lang="scss" scoped>
#learn-symbols {
  display: flex;
  flex-flow: row nowrap;
  justify-content: safe center;
  padding: 0 50px;
  overflow-x: scroll;

  &.overflowing {
    justify-content: inherit;
  }

  &::-webkit-scrollbar {
    display: none;
  }

  > *:not(:last-child) {
    flex: 0 0 auto;
    margin-right: 50px;
  }
}
</style>
