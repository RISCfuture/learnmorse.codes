import { type Locator, type Page } from '@playwright/test'

/**
 * Component object for the AudioErrorGuard overlay that appears
 * when the browser does not support AudioContext.
 */
export class AudioErrorGuard {
  readonly page: Page
  readonly container: Locator
  readonly title: Locator
  readonly message: Locator

  constructor(page: Page) {
    this.page = page
    this.container = page.locator('.audio-error-guard')
    this.title = this.container.getByRole('heading', { level: 1 })
    this.message = this.container.locator('p')
  }

  async boundingBox() {
    return this.container.boundingBox()
  }
}
