import { expect, type Locator, type Page } from '@playwright/test'

/**
 * Component object for the test input field where the user types
 * their transcription of the Morse code audio.
 */
export class TestField {
  readonly page: Page
  readonly answerKey: Locator
  readonly textbox: Locator

  constructor(page: Page) {
    this.page = page
    this.answerKey = page.getByTestId('answerKey')
    this.textbox = page.getByRole('textbox')
  }

  /**
   * Waits for the answer to be populated and stabilized, then types the
   * result of {@link answerFunction} into the textbox.
   *
   * @param answerFunction A function that receives the correct answer and
   *   returns the text to type. May include `{enter}` suffix to submit.
   */
  async typeAnswer(answerFunction: (answer: string) => string) {
    // Wait for the answer to be populated (it's set onMounted)
    await expect(this.answerKey).not.toHaveValue('', { timeout: 10000 })

    // Wait for the answer to stabilize (Vue may regenerate it): the value must
    // stay non-empty and unchanged across consecutive auto-retried polls.
    let previousAnswer = ''
    let stableCount = 0
    await expect
      .poll(
        async () => {
          const currentAnswer = await this.answerKey.inputValue()
          if (currentAnswer !== '' && currentAnswer === previousAnswer) {
            stableCount++
          } else {
            stableCount = 0
          }
          previousAnswer = currentAnswer
          return stableCount
        },
        { timeout: 10000 },
      )
      .toBeGreaterThanOrEqual(3)

    const answer = previousAnswer
    const textToType = answerFunction(answer)

    // Focus the textbox first to ensure it's ready for input
    await this.textbox.focus()

    // Handle {enter} specially - Playwright uses 'Enter' instead
    if (textToType.endsWith('{enter}')) {
      const textWithoutEnter = textToType.slice(0, -7)
      await this.textbox.pressSequentially(textWithoutEnter)
      await this.textbox.press('Enter')
    } else {
      await this.textbox.pressSequentially(textToType)
    }
  }
}
