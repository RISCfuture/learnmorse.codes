<template>
  <div id="practice">
    <transition appear mode="out-in" name="in-fade-out-fade">
      <get-ready v-if="isStarting" key="starting" />

      <test
        v-else-if="isTesting"
        key="testing"
        :lesson="lesson"
        @finished="onTestingFinished($event)"
      />

      <result
        v-else-if="showResult"
        key="scoring"
        :diff="diff!"
        :penalty="penalty!"
        :show-diff="true"
      />
    </transition>
  </div>
</template>

<script setup lang="ts">
import GetReady from '@/views/home/lesson/GetReady.vue'
import Result from '@/views/home/lesson/Result.vue'
import Test from '@/views/home/lesson/Test.vue'
import { computed } from 'vue'
import { lastLessonNumber } from '@/data/koch'
import { useTestFlow } from '@/composables/useTestFlow'

/**
 * This view allows a user who has completed all lessons to continue to test him/herself. Very
 * similar to the {@link Lesson} view without the "learning" portion and without lesson
 * advancement (only alternates between {@link Test} and {@link Result}).
 *
 * Because the {@link Test} view must display its own "Start Test" button on mobile devices, the
 * _starting_ state is skipped on mobile devices. After the learning portion is complete on
 * mobile, the view proceeds directly to the _testing_ state, where the "Start Test" button is
 * shown.
 */

const { isStarting, isTesting, showResult, diff, penalty, onTestingFinished } = useTestFlow()

const lesson = computed(() => lastLessonNumber)
</script>

<style lang="scss">
@use '@/assets/styles/responsive';

#practice #test {
  @include responsive.top-margin-large;
}
</style>
