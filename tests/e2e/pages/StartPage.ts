import { type Locator, type Page } from '@playwright/test'
import { AudioErrorGuard } from '../components/AudioErrorGuard'

/**
 * Page object for the initial landing page shown to new users.
 * Presents a "OK, I guess" button to begin learning.
 */
export class StartPage {
  readonly page: Page
  readonly getStartedButton: Locator
  readonly audioErrorGuard: AudioErrorGuard

  constructor(page: Page) {
    this.page = page
    this.getStartedButton = page.getByRole('link', { name: /ok, i guess/i })
    this.audioErrorGuard = new AudioErrorGuard(page)
  }

  async goto() {
    await this.page.goto('/')
  }

  async blockAudioContext() {
    await this.page.addInitScript(() => {
      // Remove AudioContext to simulate browsers that don't support it
      // @ts-expect-error - We're intentionally removing AudioContext
      delete window.AudioContext
      // @ts-expect-error - Also remove webkit prefixed version
      delete window.webkitAudioContext
    })
  }

  async clickGetStarted() {
    await this.getStartedButton.click()
  }

  async takeScreenshot(name: string) {
    await this.page.screenshot({
      path: `tests/e2e/screenshots/${name}.png`,
      fullPage: true,
    })
  }
}
