import { isUndefined } from 'lodash-es'
import { onUnmounted } from 'vue'

export type Timer = ReturnType<typeof setTimeout>

/**
 * Mixin that adds timer management to a Vue instance. All timers are tracked in an instance
 * variable, and canceled when the Vue is destroyed or when {@link cancelTimers} is called.
 */
export default function useTimers() {
  const timers: Timer[] = []

  /**
   * Schedules an action to be performed at a later time.
   *
   * @param delay The amount of time to wait before performing the action (milliseconds).
   * @param action The action to perform.
   */
  const addTimer = (delay: number, action: () => void) => {
    timers.push(setTimeout(action, delay))
  }

  /**
   * Cancels all pending actions.
   */
  const cancelTimers = () => {
    let timer: Timer | undefined
    while (!isUndefined((timer = timers.pop()))) clearTimeout(timer)
  }

  onUnmounted(() => cancelTimers())

  return {
    addTimer,
    cancelTimers
  }
}
