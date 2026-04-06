import { test, expect } from './fixtures/fixtures'
import { repeat } from 'lodash-es'
import { LessonPage } from './pages/LessonPage'
import { ResumePage } from './pages/ResumePage'
import { StartPage } from './pages/StartPage'
import { CompletedPage } from './pages/CompletedPage'

test.describe('Lesson', () => {
  test.describe('Testing to completion', () => {
    test('fails a lesson', async ({ startPage, lessonPage }) => {
      await startPage.goto()
      await startPage.clickGetStarted()

      await expect(lessonPage.symbolGuide.symbolKey('k')).toHaveClass(/hover/)
      await expect(lessonPage.symbolGuide.symbolKey('m')).toHaveClass(/hover/)

      await expect(lessonPage.getReadyMessage).toBeVisible()

      await lessonPage.testField.typeAnswer((answer) => `${repeat('a', answer.length)}{enter}`)
      await expect(lessonPage.pencilsDownMessage).toBeVisible({ timeout: 15000 })

      expect(await lessonPage.scoreResult.scoreText()).toBe('0%')
    })

    test('completes a lesson', async ({ startPage, lessonPage }) => {
      await startPage.goto()
      await startPage.clickGetStarted()

      await expect(lessonPage.symbolGuide.symbolKey('k')).toHaveClass(/hover/, {
        timeout: 10000,
      })
      await expect(lessonPage.symbolGuide.symbolKey('m')).toHaveClass(/hover/)

      await expect(lessonPage.getReadyMessage).toBeVisible()

      await lessonPage.testField.typeAnswer((answer) => `${answer.replace(/ /g, '')}o{enter}`)
      await expect(lessonPage.pencilsDownMessage).toBeVisible({ timeout: 15000 })

      expect(await lessonPage.scoreResult.scoreText()).toMatch(/9\d%/)
    })

    test('gets extra credit', async ({ createPageWithStorage }) => {
      const page = await createPageWithStorage({ lastAchievedLesson: '0' })
      const resumePage = new ResumePage(page)
      const lessonPage = new LessonPage(page)

      await resumePage.clickLetsDoIt()

      await expect(lessonPage.symbolGuide.symbolKey('r')).toHaveClass(/hover/, {
        timeout: 10000,
      })

      await expect(lessonPage.getReadyMessage).toBeVisible()

      await lessonPage.testField.typeAnswer((answer) => `${answer}o{enter}`)
      await expect(lessonPage.pencilsDownMessage).toBeVisible({ timeout: 15000 })

      expect(await lessonPage.scoreResult.scoreText()).toMatch(/9\d%/)
      expect(await lessonPage.scoreResult.extraCreditText()).toMatch(
        /^\.\.\.plus (an|\d+) extra points? for typing those spaces!$/,
      )
    })

    test('gets a perfect score', async ({ createPageWithStorage }) => {
      const page = await createPageWithStorage({ lastAchievedLesson: '1' })
      const resumePage = new ResumePage(page)
      const lessonPage = new LessonPage(page)

      await resumePage.clickLetsDoIt()

      await expect(lessonPage.symbolGuide.symbolKey('s')).toHaveClass(/hover/, {
        timeout: 10000,
      })

      await expect(lessonPage.getReadyMessage).toBeVisible()

      await lessonPage.testField.typeAnswer((answer) => `${answer}{enter}`)
      await expect(lessonPage.pencilsDownMessage).toBeVisible({ timeout: 15000 })

      expect(await lessonPage.scoreResult.scoreText()).toBe('100%')
    })
  })

  test.describe('Other testing', () => {
    test.skip('times out a lesson', async ({ createPageWithStorage }) => {
      const page = await createPageWithStorage({ lastAchievedLesson: '2' })
      const resumePage = new ResumePage(page)
      const lessonPage = new LessonPage(page)

      await resumePage.clickLetsDoIt()

      await expect(lessonPage.symbolGuide.symbolKey('u')).toHaveClass(/hover/, {
        timeout: 10000,
      })

      // Wait for the test to timeout (5 seconds)
      await expect(lessonPage.abandonedMessage).toBeVisible({ timeout: 70000 })
      await lessonPage.retryButton.click()

      await expect(lessonPage.getReadyMessage).toBeVisible()
    })

    test('returns to a lesson', async ({ createPageWithStorage }) => {
      const page = await createPageWithStorage({ lastAchievedLesson: '2' })
      const resumePage = new ResumePage(page)
      const lessonPage = new LessonPage(page)

      await expect(resumePage.heading).toBeVisible()
      await resumePage.clickLetsDoIt()

      await expect(lessonPage.symbolGuide.symbolKey('u')).toHaveClass(/hover/)
    })

    test('moves between lessons with the arrow key', async ({ createPageWithStorage }) => {
      const page = await createPageWithStorage({ lastAchievedLesson: '2' })
      const resumePage = new ResumePage(page)
      const lessonPage = new LessonPage(page)

      await resumePage.clickLetsDoIt()

      await lessonPage.pressArrowLeft()
      await expect(lessonPage.symbolGuide.symbolKey('s')).toHaveClass(/hover/)

      await lessonPage.pressArrowRight()
      await expect(lessonPage.symbolGuide.symbolKey('u')).toHaveClass(/hover/)

      await expect(lessonPage.getReadyMessage).toBeVisible()

      await lessonPage.pressArrowRight()
      await expect(lessonPage.symbolGuide.symbolKey('a')).toHaveClass(/hover/)
    })
  })

  test.describe('Completion', () => {
    test('completes the whole course', async ({ createPageWithStorage }) => {
      const page = await createPageWithStorage({ lastAchievedLesson: '48' })
      const resumePage = new ResumePage(page)
      const lessonPage = new LessonPage(page)

      await resumePage.clickLetsDoIt()

      await expect(lessonPage.symbolGuide.symbolKey('@')).toHaveClass(/hover/, {
        timeout: 10000,
      })
      await expect(lessonPage.getReadyMessage).toBeVisible({ timeout: 10000 })

      await lessonPage.testField.typeAnswer((answer) => `${answer}{enter}`)
      await expect(lessonPage.pencilsDownMessage).toBeVisible({ timeout: 30000 })

      expect(await lessonPage.scoreResult.scoreText()).toBe('100%')

      await expect(lessonPage.youDidItMessage).toBeVisible({ timeout: 10000 })
    })

    test('practices and fails', async ({ createPageWithStorage }) => {
      const page = await createPageWithStorage({ lastAchievedLesson: '49' })
      const completedPage = new CompletedPage(page)
      const lessonPage = new LessonPage(page)

      await expect(completedPage.practiceMoreButton).toBeVisible()
      await completedPage.clickPracticeMore()

      await expect(lessonPage.getReadyMessage).toBeVisible({ timeout: 10000 })

      await lessonPage.testField.typeAnswer((answer) => `${repeat('a', answer.length)}{enter}`)
      await expect(lessonPage.pencilsDownMessage).toBeVisible({ timeout: 15000 })

      expect(await lessonPage.scoreResult.scoreText()).toBe('0%')
      await expect(lessonPage.scoreResult.diff).toBeVisible()
    })

    test('practices and succeeds', async ({ createPageWithStorage }) => {
      const page = await createPageWithStorage({ lastAchievedLesson: '49' })
      const completedPage = new CompletedPage(page)
      const lessonPage = new LessonPage(page)

      await completedPage.clickPracticeMore()

      await expect(lessonPage.getReadyMessage).toBeVisible({ timeout: 10000 })

      await lessonPage.testField.typeAnswer((answer) => `${answer}{enter}`)
      await expect(lessonPage.pencilsDownMessage).toBeVisible({ timeout: 15000 })

      expect(await lessonPage.scoreResult.scoreText()).toBe('100%')
      await expect(lessonPage.scoreResult.diff).toBeVisible()
    })

    test('restarts progress', async ({ createPageWithStorage }) => {
      const page = await createPageWithStorage({ lastAchievedLesson: '49' })
      const completedPage = new CompletedPage(page)
      const startPage = new StartPage(page)
      const lessonPage = new LessonPage(page)

      await completedPage.clickResetProgress()

      await startPage.clickGetStarted()

      await expect(lessonPage.symbolGuide.symbolKey('k')).toHaveClass(/hover/)
      await expect(lessonPage.symbolGuide.symbolKey('m')).toHaveClass(/hover/)
    })
  })
})
