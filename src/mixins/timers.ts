import Vue from 'vue'
import Component from 'vue-class-component'
import { isUndefined } from 'lodash-es'

/**
 * Mixin that adds timer management to a Vue instance. All timers are tracked in an instance
 * variable, and canceled when the Vue is destroyed or when {@link cancelTimers} is called.
 */

@Component
export default class Timers extends Vue {
  private timers: number[] = []

  /**
   * Schedules an action to be performed at a later time.
   *
   * @param delay The amount of time to wait before performing the action (milliseconds).
   * @param action The action to perform.
   */

  protected addTimer(delay: number, action: () => void): void {
    this.timers.push(setTimeout(action, delay))
  }

  /**
   * Cancels all pending actions.
   */

  protected cancelTimers(): void {
    let timer: number | undefined
    // eslint-disable-next-line no-cond-assign
    while (!isUndefined(timer = this.timers.pop())) clearTimeout(timer)
  }

  beforeDestroy(): void {
    this.cancelTimers()
  }
}
