import { type Locator, type Page } from '@playwright/test'

/**
 * Component object for the symbol guide strip that displays
 * the symbols covered in the current lesson.
 */
export class SymbolGuide {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  symbolKey(symbol: string): Locator {
    return this.page.getByTestId(`symbolKey-${symbol}`)
  }
}
