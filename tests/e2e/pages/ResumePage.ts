import { type Locator, type Page } from '@playwright/test'

/**
 * Page object for the resume page shown to returning users who
 * have previously made progress. Displays "Ready to pick up where
 * you left off?" with a "Let's do it" button.
 */
export class ResumePage {
  readonly page: Page
  readonly heading: Locator
  readonly letsDoItButton: Locator

  constructor(page: Page) {
    this.page = page
    this.heading = page.getByText('Ready to pick up where you left off?')
    this.letsDoItButton = page.getByRole('link', { name: /Let.?s do it/ })
  }

  async clickLetsDoIt() {
    await this.letsDoItButton.click()
  }
}
