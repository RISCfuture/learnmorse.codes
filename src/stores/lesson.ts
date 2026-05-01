import { defineStore } from 'pinia'
import { symbolOrder } from '@/data/koch'
import * as Sentry from '@sentry/vue'
import { useLocalStorage } from '@vueuse/core'

export interface State {
  currentLesson: number
}

export const MAX_LESSON = symbolOrder.length - 1

const lastAchievedLesson = useLocalStorage<number | null>('lastAchievedLesson', null, {
  serializer: {
    read: (v) => Number.parseInt(v),
    write: String,
  },
})

export const useLessonStore = defineStore('lesson', {
  state: () => ({ currentLesson: 0 }) as State,
  actions: {
    /** Moves the user to the next lesson. */
    incrementLesson() {
      if (this.currentLesson === MAX_LESSON) return
      this.$patch({ currentLesson: this.currentLesson + 1 })
    },

    /** Moves the user to the previous lesson. */
    decrementLesson() {
      if (this.currentLesson === 0) return
      this.$patch({ currentLesson: this.currentLesson - 1 })
    },

    /**
     * Clears the recorded lesson progress and moves the user back to the un-started _welcome_
     * state.
     */
    resetLesson() {
      this.currentLesson = 0
      lastAchievedLesson.value = null
    },

    /**
     * Records to local storage that a user has completed a lesson. Note that because of animation
     * timing, this can occur multiple seconds prior to when `currentLesson` is advanced to the next
     * lesson.
     *
     * @param lesson The lesson the user passed.
     */
    storeSuccess(lesson: number) {
      lastAchievedLesson.value = lesson

      Sentry.metrics.count('lesson.completed', 1, {
        attributes: { lesson: lesson.toString() },
      })
    },

    /** Reads stored progress and sets the current lesson accordingly. */
    restore() {
      const lessonNum = lastAchievedLesson.value
      if (lessonNum !== null) {
        this.$patch({ currentLesson: lessonNum + 1 })

        const progressPercent = Math.round((lessonNum / MAX_LESSON) * 100)
        Sentry.metrics.gauge('curriculum.progress', progressPercent, {
          unit: 'percent',
          attributes: { lesson: (lessonNum + 1).toString() },
        })

        return true
      }
      return false
    },
  },
})
