import { type Locator, type Page } from '@playwright/test'
import { SymbolGuide } from '../components/SymbolGuide'
import { TestField } from '../components/TestField'
import { ScoreResult } from '../components/ScoreResult'

/**
 * Page object for the lesson view. Composes the symbol guide,
 * test field, and score result components. Provides access to
 * status messages like "Get ready..." and "Pencils down!".
 */
export class LessonPage {
  readonly page: Page
  readonly symbolGuide: SymbolGuide
  readonly testField: TestField
  readonly scoreResult: ScoreResult
  readonly getReadyMessage: Locator
  readonly pencilsDownMessage: Locator
  readonly abandonedMessage: Locator
  readonly retryButton: Locator
  readonly youDidItMessage: Locator

  constructor(page: Page) {
    this.page = page
    this.symbolGuide = new SymbolGuide(page)
    this.testField = new TestField(page)
    this.scoreResult = new ScoreResult(page)
    this.getReadyMessage = page.getByText('Get ready...')
    this.pencilsDownMessage = page.getByText('Pencils down!')
    this.abandonedMessage = page.getByText('Did it get away from you?')
    this.retryButton = page.getByRole('link', { name: /OK.*Let.?s go again/ })
    this.youDidItMessage = page.getByText('You did it!')
  }

  async pressArrowLeft() {
    await this.page.keyboard.press('ArrowLeft')
  }

  async pressArrowRight() {
    await this.page.keyboard.press('ArrowRight')
  }
}
