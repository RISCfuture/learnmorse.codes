import { test, expect, type Page, type BrowserContext } from '@playwright/test'
import { repeat, toString, trim } from 'lodash-es'

// Helper functions to replace custom Cypress commands
async function testInput(page: Page, answerFunction: (answer: string) => string) {
  const answerKey = page.getByTestId('answerKey')

  // Wait for the answer to be populated (it's set onMounted)
  await expect(answerKey).not.toHaveValue('', { timeout: 10000 })

  // Wait for the answer to stabilize (Vue may regenerate it)
  let answer = ''
  let stableCount = 0
  while (stableCount < 3) {
    const currentAnswer = await answerKey.inputValue()
    if (currentAnswer === answer) {
      stableCount++
    } else {
      answer = currentAnswer
      stableCount = 0
    }
    await page.waitForTimeout(100)
  }

  expect(answer).not.toBe('')

  const textbox = page.getByRole('textbox')
  const textToType = answerFunction(toString(answer))

  // Focus the textbox first to ensure it's ready for input
  await textbox.focus()

  // Handle {enter} specially - Playwright uses 'Enter' instead
  if (textToType.endsWith('{enter}')) {
    const textWithoutEnter = textToType.slice(0, -7) // Remove '{enter}'
    // Use pressSequentially without delay - fast enough with increased timeout
    await textbox.pressSequentially(textWithoutEnter)
    await textbox.press('Enter')
  } else {
    await textbox.pressSequentially(textToType)
  }
}

async function shouldHaveText(locator: ReturnType<Page['getByTestId']>, text: string) {
  const content = await locator.textContent()
  expect(trim(content ?? '')).toBe(text)
}

async function shouldMatchText(locator: ReturnType<Page['getByTestId']>, rx: RegExp) {
  const content = await locator.textContent()
  expect(trim(content ?? '')).toMatch(rx)
}

// Helper to create a page with localStorage set
async function createPageWithStorage(
  context: BrowserContext,
  storage: Record<string, string>
): Promise<Page> {
  // Create a new page in the context
  const page = await context.newPage()

  // First, navigate to set the origin
  await page.goto('/')

  // Set localStorage items
  await page.evaluate((storageData) => {
    for (const [key, value] of Object.entries(storageData)) {
      localStorage.setItem(key, value)
    }
  }, storage)

  // Reload to ensure the app picks up the localStorage changes
  // Wait for load event to ensure Vue app is fully initialized
  await page.reload({ waitUntil: 'load' })

  return page
}

test.describe('Lesson', () => {
  test.describe('Testing to completion', () => {
    test('fails a lesson', async ({ page }) => {
      await page.goto('/')
      await page.getByText('OK, I guess').click()

      await expect(page.getByTestId('symbolKey-k')).toHaveClass(/hover/)
      await expect(page.getByTestId('symbolKey-m')).toHaveClass(/hover/)

      await expect(page.getByText('Get ready...')).toBeVisible()

      await testInput(page, (answer) => `${repeat('a', answer.length)}{enter}`)
      await expect(page.getByText('Pencils down!')).toBeVisible({ timeout: 15000 })

      await shouldHaveText(page.getByTestId('score'), '0%')
    })

    test('completes a lesson', async ({ page }) => {
      await page.goto('/')
      await page.getByText('OK, I guess').click()

      await expect(page.getByTestId('symbolKey-k')).toHaveClass(/hover/, { timeout: 10000 })
      await expect(page.getByTestId('symbolKey-m')).toHaveClass(/hover/)

      await expect(page.getByText('Get ready...')).toBeVisible()

      await testInput(page, (answer) => `${answer.replace(/ /g, '')}o{enter}`)
      await expect(page.getByText('Pencils down!')).toBeVisible({ timeout: 15000 })

      await shouldMatchText(page.getByTestId('score'), /9\d%/)
    })

    test('gets extra credit', async ({ context }) => {
      const page = await createPageWithStorage(context, { lastAchievedLesson: '0' })
      await page.getByRole('link', { name: /Let.?s do it/ }).click()

      await expect(page.getByTestId('symbolKey-r')).toHaveClass(/hover/, { timeout: 10000 })

      await expect(page.getByText('Get ready...')).toBeVisible()

      await testInput(page, (answer) => `${answer}o{enter}`)
      await expect(page.getByText('Pencils down!')).toBeVisible({ timeout: 15000 })

      await shouldMatchText(page.getByTestId('score'), /9\d%/)
      await shouldMatchText(
        page.getByTestId('extraCredit'),
        /^\.\.\.plus (an|\d+) extra points? for typing those spaces!$/
      )

      await page.close()
    })

    test('gets a perfect score', async ({ context }) => {
      const page = await createPageWithStorage(context, { lastAchievedLesson: '1' })
      await page.getByRole('link', { name: /Let.?s do it/ }).click()

      await expect(page.getByTestId('symbolKey-s')).toHaveClass(/hover/, { timeout: 10000 })

      await expect(page.getByText('Get ready...')).toBeVisible()

      await testInput(page, (answer) => `${answer}{enter}`)
      await expect(page.getByText('Pencils down!')).toBeVisible({ timeout: 15000 })

      await shouldHaveText(page.getByTestId('score'), '100%')

      await page.close()
    })
  })

  test.describe('Other testing', () => {
    test.skip('times out a lesson', async ({ context }) => {
      const page = await createPageWithStorage(context, { lastAchievedLesson: '2' })
      await page.getByRole('link', { name: /Let.?s do it/ }).click()

      await expect(page.getByTestId('symbolKey-u')).toHaveClass(/hover/, { timeout: 10000 })

      // Wait for the test to timeout (5 seconds)
      await expect(page.getByText('Did it get away from you?')).toBeVisible({ timeout: 70000 })
      await page.getByRole('button', { name: /OK.*Let.?s go again/ }).click()

      await expect(page.getByText('Get ready...')).toBeVisible()

      await page.close()
    })

    test('returns to a lesson', async ({ context }) => {
      const page = await createPageWithStorage(context, { lastAchievedLesson: '2' })

      await expect(page.getByText('Ready to pick up where you left off?')).toBeVisible()
      await page.getByRole('link', { name: /Let.?s do it/ }).click()

      await expect(page.getByTestId('symbolKey-u')).toHaveClass(/hover/)

      await page.close()
    })

    test('moves between lessons with the arrow key', async ({ context }) => {
      const page = await createPageWithStorage(context, { lastAchievedLesson: '2' })
      await page.getByRole('link', { name: /Let.?s do it/ }).click()

      await page.keyboard.press('ArrowLeft')
      await expect(page.getByTestId('symbolKey-s')).toHaveClass(/hover/)

      await page.keyboard.press('ArrowRight')
      await expect(page.getByTestId('symbolKey-u')).toHaveClass(/hover/)

      await expect(page.getByText('Get ready...')).toBeVisible()

      await page.keyboard.press('ArrowRight')
      await expect(page.getByTestId('symbolKey-a')).toHaveClass(/hover/)

      await page.close()
    })
  })

  test.describe('Completion', () => {
    test('completes the whole course', async ({ context }) => {
      const page = await createPageWithStorage(context, { lastAchievedLesson: '48' })
      await page.getByRole('link', { name: /Let.?s do it/ }).click()

      await expect(page.getByTestId('symbolKey-@')).toHaveClass(/hover/, { timeout: 10000 })
      await expect(page.getByText('Get ready...')).toBeVisible({ timeout: 10000 })

      await testInput(page, (answer) => `${answer}{enter}`)
      await expect(page.getByText('Pencils down!')).toBeVisible({ timeout: 30000 })

      await shouldHaveText(page.getByTestId('score'), '100%')

      await expect(page.getByText('You did it!')).toBeVisible({ timeout: 10000 })

      await page.close()
    })

    test('practices and fails', async ({ context }) => {
      const page = await createPageWithStorage(context, { lastAchievedLesson: '49' })

      await expect(page.getByText('Practice More')).toBeVisible()
      await page.getByText('Practice More').click({ timeout: 10000 })

      await expect(page.getByText('Get ready...')).toBeVisible({ timeout: 10000 })

      await testInput(page, (answer) => `${repeat('a', answer.length)}{enter}`)
      await expect(page.getByText('Pencils down!')).toBeVisible({ timeout: 15000 })

      await shouldHaveText(page.getByTestId('score'), '0%')
      await expect(page.getByTestId('diff')).toBeVisible()

      await page.close()
    })

    test('practices and succeeds', async ({ context }) => {
      const page = await createPageWithStorage(context, { lastAchievedLesson: '49' })
      await page.getByText('Practice More').click({ timeout: 10000 })

      await expect(page.getByText('Get ready...')).toBeVisible({ timeout: 10000 })

      await testInput(page, (answer) => `${answer}{enter}`)
      await expect(page.getByText('Pencils down!')).toBeVisible({ timeout: 15000 })

      await shouldHaveText(page.getByTestId('score'), '100%')
      await expect(page.getByTestId('diff')).toBeVisible()

      await page.close()
    })

    test('restarts progress', async ({ context }) => {
      const page = await createPageWithStorage(context, { lastAchievedLesson: '49' })

      await page.getByText('Reset Progress').click()

      await page.getByText('OK, I guess').click()

      await expect(page.getByTestId('symbolKey-k')).toHaveClass(/hover/)
      await expect(page.getByTestId('symbolKey-m')).toHaveClass(/hover/)

      await page.close()
    })
  })
})
