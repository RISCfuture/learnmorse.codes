import { test, expect } from '@playwright/test'

test.describe('Audio Error Guard', () => {
  test('should display fullscreen error when AudioContext is unavailable', async ({ page }) => {
    // Navigate to the page and block AudioContext before it loads
    await page.addInitScript(() => {
      // Remove AudioContext to simulate browsers that don't support it
      // @ts-expect-error - We're intentionally removing AudioContext
      delete window.AudioContext
      // @ts-expect-error - Also remove webkit prefixed version
      delete window.webkitAudioContext
    })

    await page.goto('/')

    // Wait for the page to load and click the "OK, I guess" button
    const getStartedButton = page.getByRole('link', { name: /ok, i guess/i })
    await expect(getStartedButton).toBeVisible({ timeout: 10000 })
    await getStartedButton.click()

    // Wait for the error guard to appear
    const errorGuard = page.locator('.audio-error-guard')
    await expect(errorGuard).toBeVisible()

    // Check that the error content is displayed
    const errorTitle = errorGuard.locator('h1')
    await expect(errorTitle).toContainText('Audio Not Supported')

    const errorMessage = errorGuard.locator('p')
    await expect(errorMessage).toContainText('Your browser does not support audio playback')

    // Take a screenshot of the error state
    await page.screenshot({ path: 'tests/e2e/screenshots/audio-error-guard.png', fullPage: true })

    // Verify that the error guard takes over the full screen
    const boundingBox = await errorGuard.boundingBox()
    expect(boundingBox).toBeTruthy()

    // The error guard should cover the entire viewport
    const viewport = page.viewportSize()
    if (boundingBox && viewport) {
      expect(boundingBox.width).toBeGreaterThanOrEqual(viewport.width * 0.99)
      expect(boundingBox.height).toBeGreaterThanOrEqual(viewport.height * 0.99)
    }
  })

  test('should work normally when AudioContext is available', async ({ page }) => {
    // Navigate normally without blocking AudioContext
    await page.goto('/')

    // Wait for the "OK, I guess" button to be visible (ensures page is loaded)
    const getStartedButton = page.getByRole('link', { name: /ok, i guess/i })
    await expect(getStartedButton).toBeVisible({ timeout: 10000 })

    // Take a screenshot of the normal start page
    await page.screenshot({ path: 'tests/e2e/screenshots/normal-start-page.png', fullPage: true })

    // Click the button
    await getStartedButton.click()

    // The error guard should NOT be visible
    const errorGuard = page.locator('.audio-error-guard')
    await expect(errorGuard).toBeHidden()

    // The lesson should start normally
    // (You can add more assertions here based on what happens after clicking "Get Started")
  })
})
