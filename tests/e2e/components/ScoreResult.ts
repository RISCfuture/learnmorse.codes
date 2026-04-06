import { type Locator, type Page } from '@playwright/test'
import { trim } from 'lodash-es'

/**
 * Component object for the score result display shown after
 * a test completes, including score, extra credit, and diff.
 */
export class ScoreResult {
  readonly page: Page
  readonly score: Locator
  readonly extraCredit: Locator
  readonly diff: Locator

  constructor(page: Page) {
    this.page = page
    this.score = page.getByTestId('score')
    this.extraCredit = page.getByTestId('extraCredit')
    this.diff = page.getByTestId('diff')
  }

  async scoreText(): Promise<string> {
    const content = await this.score.textContent()
    return trim(content ?? '')
  }

  async extraCreditText(): Promise<string> {
    const content = await this.extraCredit.textContent()
    return trim(content ?? '')
  }
}
