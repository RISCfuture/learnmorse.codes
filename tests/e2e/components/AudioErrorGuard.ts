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
    this.container = page.getByTestId('audioErrorGuard')
    this.title = this.container.getByRole('heading', { level: 1 })
    this.message = this.container.getByTestId('audioErrorGuardMessage')
  }

  async boundingBox() {
    return this.container.boundingBox()
  }
}
