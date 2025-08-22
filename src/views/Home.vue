<template>
  <div id="container">
    <transition name="out-move-up">
      <practice-view v-if="showPractice" />
      <completed-view v-else-if="showCompleted" @practice="practice = true" />
      <resume-view v-else-if="showResume" @started="started = true" />
      <lesson-view v-else-if="showLesson" />
      <start-view v-else @started="started = true" />
    </transition>

    <transition appear name="in-fade-3">
      <footer-view />
    </transition>
  </div>
</template>

<script setup lang="ts">
import PracticeView from '@/views/home/Practice.vue'
import CompletedView from '@/views/home/Completed.vue'
import ResumeView from '@/views/home/Resume.vue'
import StartView from '@/views/home/Start.vue'
import LessonView from '@/views/home/Lesson.vue'
import FooterView from '@/views/FooterView.vue'
import { computed, onMounted, ref } from 'vue'
import { useLessonStore } from '@/stores/lesson'
import { lastLessonNumber } from '@/data/koch'
import { storeToRefs } from 'pinia'

/**
 * The root content container for the application. This Vue manages the transitions between each
 * of the top-level states. Sub-Vues handle rendering for each state.
 */

const started = ref(false)
const practice = ref(false)

const lessonStore = useLessonStore()
const { currentLesson } = storeToRefs(lessonStore)

const showResume = computed(() => !started.value && currentLesson.value > 0)
const showLesson = computed(
  () => started.value && currentLesson.value <= lastLessonNumber && !practice.value
)
const showPractice = computed(() => practice.value)
const showCompleted = computed(() => currentLesson.value > lastLessonNumber)

onMounted(() => lessonStore.restore())
</script>

<style lang="scss">
@use '@/assets/styles/responsive';

#container {
  flex: 0 0 auto;
  width: 90vw;
  max-width: 800px;

  @include responsive.fill-height;

  @include responsive.large {
    min-height: responsive.vh(90);
    margin-top: responsive.vh(10);
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
