/* eslint-disable no-shadow */

import {
  ActionTree, GetterTree, Module, MutationTree
} from 'vuex'
import { isNull } from 'lodash-es'
import { symbolOrder } from '@/data/koch'
import { RootState } from '@/store/root'

export interface LessonState {
  currentLesson: number
}

const MAX_LESSON = symbolOrder.length - 1

function state(): LessonState {
  return { currentLesson: 0 }
}

const getters: GetterTree<LessonState, RootState> = {

  /**
   * Returns the lesson the user is currently attempting to pass, or `null` if s/he hasn't started
   * yet.
   */
  currentLesson(state): number | null {
    return state.currentLesson
  }
}

const mutations: MutationTree<LessonState> = {
  INCREMENT_LESSON(state) {
    if (isNull(state.currentLesson)) state.currentLesson = 0
    if (state.currentLesson === MAX_LESSON) return
    state.currentLesson += 1
  },

  DECREMENT_LESSON(state) {
    if (isNull(state.currentLesson)) return
    state.currentLesson -= 1
  },

  SET_LESSON(state, { lesson }) {
    state.currentLesson = lesson
  },

  RESET_LESSON(state) {
    state.currentLesson = 0
  }
}

const actions: ActionTree<LessonState, RootState> = {
  /** Moves the user to the next lesson. */
  incrementLesson({ commit }): Promise<void> {
    return new Promise(resolve => {
      commit('INCREMENT_LESSON')
      resolve()
    })
  },

  /** Moves the user to the previous lesson. */
  decrementLesson({ commit }): Promise<void> {
    return new Promise(resolve => {
      commit('DECREMENT_LESSON')
      resolve()
    })
  },

  /**
   * Clears the current lesson from local storage and moves the user to the un-started _welcome_
   * state.
   */
  resetLesson({ commit }): Promise<void> {
    return new Promise(resolve => {
      commit('RESET_LESSON')
      localStorage.clear()
      resolve()
    })
  },

  /**
   * Records to local storage that a user has completed a lesson. Note that because of animation
   * timing, this can occur multiple seconds prior to when `currentLesson` is advanced to the next
   * lesson.
   *
   * @param lesson The lesson the user passed.
   */
  storeSuccess(_, { lesson }: {lesson: number}): Promise<void> {
    return new Promise(resolve => {
      localStorage.setItem('lastAchievedLesson', lesson.toString())
      resolve()
    })
  },

  /** Reads local storage and sets the current lesson accordingly. */
  restore({ commit }): Promise<boolean> {
    return new Promise(resolve => {
      const lastAchievedLesson = localStorage.getItem('lastAchievedLesson')
      if (!isNull(lastAchievedLesson)) {
        commit('SET_LESSON', { lesson: Number.parseInt(lastAchievedLesson, 10) + 1 })
        resolve(true)
      } else resolve(false)
    })
  }
}

const lesson: Module<LessonState, RootState> = {
  state, getters, mutations, actions
}
export default lesson
