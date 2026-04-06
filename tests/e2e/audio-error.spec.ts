import { test, expect } from './fixtures/fixtures'

test.describe('Audio Error Guard', () => {
  test('should display fullscreen error when AudioContext is unavailable', async ({
    startPage,
  }) => {
    // Block AudioContext before navigating
    await startPage.blockAudioContext()
    await startPage.goto()

    // Wait for the page to load and click the "OK, I guess" button
    await expect(startPage.getStartedButton).toBeVisible({ timeout: 10000 })
    await startPage.clickGetStarted()

    // Wait for the error guard to appear
    const { audioErrorGuard } = startPage
    await expect(audioErrorGuard.container).toBeVisible()

    // Check that the error content is displayed
    await expect(audioErrorGuard.title).toContainText('Audio Not Supported')
    await expect(audioErrorGuard.message).toContainText(
      'Your browser does not support audio playback',
    )

    // Take a screenshot of the error state
    await startPage.takeScreenshot('audio-error-guard')

    // Verify that the error guard takes over the full screen
    const boundingBox = await audioErrorGuard.boundingBox()
    expect(boundingBox).toBeTruthy()

    // The error guard should cover the entire viewport
    const viewport = startPage.page.viewportSize()
    if (boundingBox && viewport) {
      expect(boundingBox.width).toBeGreaterThanOrEqual(viewport.width * 0.99)
      expect(boundingBox.height).toBeGreaterThanOrEqual(viewport.height * 0.99)
    }
  })

  test('should work normally when AudioContext is available', async ({ startPage }) => {
    // Navigate normally without blocking AudioContext
    await startPage.goto()

    // Wait for the "OK, I guess" button to be visible (ensures page is loaded)
    await expect(startPage.getStartedButton).toBeVisible({ timeout: 10000 })

    // Take a screenshot of the normal start page
    await startPage.takeScreenshot('normal-start-page')

    // Click the button
    await startPage.clickGetStarted()

    // The error guard should NOT be visible
    await expect(startPage.audioErrorGuard.container).toBeHidden()
  })
})
