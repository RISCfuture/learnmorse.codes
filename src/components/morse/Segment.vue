<template>
  <pulse :color="colorClass" :width="width" />
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Prop } from 'vue-property-decorator'
  import { Segment as SegmentType } from '@/util/morse/code'
  import { segmentUnitWidth } from '@/util/morse/timing'
  import Pulse from '@/components/morse/Pulse.vue'
  @Component({
    components: { Pulse }
  })
  export default class Segment extends Vue {
    @Prop({ type: Number, required: true }) segment!: SegmentType

    get width(): number {
      return segmentUnitWidth[this.segment]
    }

    get colorClass(): string {
      switch (this.segment) {
        case SegmentType.DIT:
        case SegmentType.DAH:
          return 'text'
        default:
          return 'transparent'
      }
    }
  }
</script>
