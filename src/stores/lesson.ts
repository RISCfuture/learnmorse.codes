import { defineStore } from 'pinia'
import { symbolOrder } from '@/data/koch'
import { isNull } from 'lodash-es'

export interface State {
  currentLesson: number
}

export const MAX_LESSON = symbolOrder.length - 1

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
     * Clears the current lesson from local storage and moves the user to the un-started _welcome_
     * state.
     */
    resetLesson() {
      this.currentLesson = 0
      localStorage.clear()
    },

    /**
     * Records to local storage that a user has completed a lesson. Note that because of animation
     * timing, this can occur multiple seconds prior to when `currentLesson` is advanced to the next
     * lesson.
     *
     * @param lesson The lesson the user passed.
     */
    storeSuccess(lesson: number) {
      localStorage.setItem('lastAchievedLesson', lesson.toString())
    },

    /** Reads local storage and sets the current lesson accordingly. */
    restore() {
      const lastAchievedLesson = localStorage.getItem('lastAchievedLesson')
      if (!isNull(lastAchievedLesson)) {
        this.$patch({ currentLesson: Number.parseInt(lastAchievedLesson) + 1 })
        return true
      }
      return false
    }
  }
})
