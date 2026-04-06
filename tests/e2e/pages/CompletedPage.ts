import { type Locator, type Page } from '@playwright/test'

/**
 * Page object for the course completion page shown after a user
 * completes all lessons. Offers "Practice More" and "Reset Progress"
 * options.
 */
export class CompletedPage {
  readonly page: Page
  readonly practiceMoreButton: Locator
  readonly resetProgressButton: Locator

  constructor(page: Page) {
    this.page = page
    this.practiceMoreButton = page.getByText('Practice More')
    this.resetProgressButton = page.getByText('Reset Progress')
  }

  async clickPracticeMore() {
    await this.practiceMoreButton.click({ timeout: 10000 })
  }

  async clickResetProgress() {
    await this.resetProgressButton.click()
  }
}
