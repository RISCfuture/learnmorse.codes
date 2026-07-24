import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const reload = vi.fn()

let unregisterListener: (() => void) | undefined

// The listener each copy of the module leaves on `window` is captured so it can't outlive the
// test that installed it.
async function loadPage(): Promise<void> {
  vi.resetModules()
  const { recoverFromPreloadErrors } = await import('../preloadRecovery')

  const addEventListener = vi.spyOn(window, 'addEventListener')
  recoverFromPreloadErrors()
  const [type, listener] = addEventListener.mock.lastCall ?? []
  addEventListener.mockRestore()

  unregisterListener = () => {
    if (type && listener) window.removeEventListener(type, listener)
  }
}

/** Dispatches the event Vite's preload helper fires, returning whether the rethrow was suppressed. */
function failPreload(): boolean {
  const event = new Event('vite:preloadError', { cancelable: true })
  window.dispatchEvent(event)
  return event.defaultPrevented
}

describe('preloadRecovery', () => {
  beforeEach(() => {
    reload.mockClear()
    sessionStorage.clear()
    vi.stubGlobal('location', { reload })
    vi.useFakeTimers()
  })

  afterEach(() => {
    unregisterListener?.()
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('reloads the page when a chunk fails to preload', async () => {
    await loadPage()

    expect(failPreload()).toBe(true)
    expect(reload).toHaveBeenCalledOnce()
  })

  it('lets a failure through instead of reloading again during the cooldown', async () => {
    await loadPage()
    failPreload()
    reload.mockClear()

    await loadPage()
    vi.advanceTimersByTime(60_000)

    expect(failPreload()).toBe(false)
    expect(reload).not.toHaveBeenCalled()
  })

  it('reloads again once the cooldown has passed', async () => {
    await loadPage()
    failPreload()
    reload.mockClear()

    await loadPage()
    vi.advanceTimersByTime(11 * 60 * 1000)

    expect(failPreload()).toBe(true)
    expect(reload).toHaveBeenCalledOnce()
  })

  it('declines to reload when sessionStorage is unavailable', async () => {
    vi.stubGlobal('sessionStorage', {
      getItem: () => {
        throw new Error('denied')
      },
    })
    await loadPage()

    expect(failPreload()).toBe(false)
    expect(reload).not.toHaveBeenCalled()
  })
})
