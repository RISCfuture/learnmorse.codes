import { test as base, type BrowserContext, type Page } from '@playwright/test'
import { StartPage } from '../pages/StartPage'
import { ResumePage } from '../pages/ResumePage'
import { LessonPage } from '../pages/LessonPage'
import { CompletedPage } from '../pages/CompletedPage'

type Fixtures = {
  startPage: StartPage
  resumePage: ResumePage
  lessonPage: LessonPage
  completedPage: CompletedPage
  createPageWithStorage: (storage: Record<string, string>) => Promise<Page>
}

export const test = base.extend<Fixtures>({
  startPage: async ({ page }, use) => {
    await use(new StartPage(page))
  },

  resumePage: async ({ page }, use) => {
    await use(new ResumePage(page))
  },

  lessonPage: async ({ page }, use) => {
    await use(new LessonPage(page))
  },

  completedPage: async ({ page }, use) => {
    await use(new CompletedPage(page))
  },

  createPageWithStorage: async ({ context }, use) => {
    const pages: Page[] = []

    async function factory(storage: Record<string, string>): Promise<Page> {
      const page = await context.newPage()
      pages.push(page)

      // Navigate first to set the origin
      await page.goto('/')

      // Set localStorage items
      await page.evaluate((storageData) => {
        for (const [key, value] of Object.entries(storageData)) {
          localStorage.setItem(key, value)
        }
      }, storage)

      // Reload to ensure the app picks up the localStorage changes
      await page.reload({ waitUntil: 'load' })

      return page
    }

    await use(factory)

    // Clean up pages created by this fixture
    for (const page of pages) {
      if (!page.isClosed()) {
        await page.close()
      }
    }
  },
})

export { expect } from '@playwright/test'
