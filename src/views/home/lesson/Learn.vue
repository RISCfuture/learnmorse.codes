<template>
  <div id="learn-symbols" :class="{overflowing}">
    <symbol-key :audio="audio"
                :interactive="interactive"
                :key="symbol"
                :symbol="symbol"
                ref="symbolElements"
                v-for="symbol in symbols" />
  </div>
</template>

<script lang="ts">
  import Component, { mixins } from 'vue-class-component'
  import { Prop } from 'vue-property-decorator'
  import { symbolsInLesson } from '@/data/koch'
  import SymbolKey from '@/views/home/lesson/learn/Symbol.vue'
  import Timers from '@/mixins/timers'

  /**
   * Handles the "learning" portion of a lesson. Displays all of the symbols covered so far in a
   * row. Can highlight new or missed symbols to the user with {@link demonstrateSymbols}.
   */

  @Component({
    components: { SymbolKey }
  })
  export default class Learn extends mixins(Timers) {
    readonly $refs!: {
      symbolElements: SymbolKey[]
    }

    @Prop({ type: Number, required: true }) lesson!: number

    @Prop({ type: Boolean, default: true }) interactive!: boolean

    @Prop({ type: Boolean, default: true }) audio!: boolean

    demonstrating = false

    overflowing = false

    get symbols(): string[] {
      return symbolsInLesson(this.lesson)
    }

    mounted(): void {
      this.overflowing = (this.$el.scrollWidth > this.$el.clientWidth)
    }

    updated(): void {
      this.overflowing = (this.$el.scrollWidth > this.$el.clientWidth)
    }

    /**
     * Call this method to highlight one or more symbols to the user in succession.
     *
     * @param symbols The symbols to highlight.
     */

    demonstrateSymbols(symbols: string[]): void {
      if (symbols.length === 0) return

      this.cancelTimers()
      const symbolSet = new Set(symbols)

      // 1/2 second after we load...
      this.addTimer(500, () => {
        let time = 0
        let firstSymbol = true
        this.$refs.symbolElements.forEach(element => {
          if (!symbolSet.has(element.symbol)) return

          // ... highlight a letter ...
          if (firstSymbol) {
            this.addTimer(time, () => element.demonstrate(false))
          } else {
            this.addTimer(time, () => element.demonstrate(true))
          }
          // ... then wait another 1/2 second for the next letter ...
          time = time + element.demoDuration + 1500

          firstSymbol = false
        })

        // ... then wait a full second before telling the parent we're done with the demo
        this.addTimer(time + 500, () => this.$emit('finished'))
      })
    }
  }
</script>

<style lang="scss" scoped>
  #learn-symbols {
    display: flex;
    flex-flow: row nowrap;
    justify-content: safe center;
    overflow-x: scroll;
    padding: 0 50px;

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
