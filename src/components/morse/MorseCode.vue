<template>
  <div class="morse-code">
    <segment
      v-for="(segment, index) in sequence"
      :key="index"
      :segment="segment"
    />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Prop } from 'vue-property-decorator'
  import { messageToSequence, Segment, textToMessage } from '@/util/morse/code'
  import { default as SegmentComponent } from '@/components/morse/Segment.vue'

  /**
   * Renders a Morse code sequence in pictograph form. Note that the resulting pictograph is styled
   * as `no-wrap`, so it will overflow a smaller container.
   */

  @Component({
    components: { Segment: SegmentComponent }
  })
  export default class MorseCode extends Vue {
    /** The plaintext to render in Morse code pictographs. */
    @Prop({ type: String, required: true }) text!: string

    get sequence(): Segment[] {
      return messageToSequence(textToMessage(this.text))
    }
  }
</script>

<style scoped lang="scss">
  .morse-code {
    align-items: flex-start;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
  }
</style>
