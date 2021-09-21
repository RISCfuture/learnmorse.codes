<template>
  <pulse :color="colorClass" :width="width" />
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Prop } from 'vue-property-decorator'
  import { segmentUnitWidth } from '@/util/morse/timing'
  import Pulse from '@/components/morse/Pulse.vue'
  import { Segment } from '@/util/morse/code'

  @Component({
    components: { Pulse }
  })
  export default class SegmentView extends Vue {
    @Prop({ type: Number, required: true }) segment!: Segment

    get width(): number {
      return segmentUnitWidth[this.segment]
    }

    get colorClass(): string {
      switch (this.segment) {
      case Segment.DIT:
      case Segment.DAH:
        return 'text'
      default:
        return 'transparent'
      }
    }
  }
</script>
