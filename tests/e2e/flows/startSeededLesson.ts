import { type Page } from '@playwright/test'
import { ResumePage } from '../pages/ResumePage'
import { LessonPage } from '../pages/LessonPage'

/**
 * Handles returned by {@link startSeededLesson} so callers can compose the
 * next step of a flow or make feature assertions.
 */
export interface SeededLesson {
  /** The page seeded with progress and resumed into the lesson. */
  page: Page
  /** The resume screen the user passed through. */
  resumePage: ResumePage
  /** The lesson the user resumed into. */
  lessonPage: LessonPage
}

/**
 * Seeds a returning user's progress, then resumes into their lesson.
 *
 * Composes the {@link ResumePage} and {@link LessonPage} construction that is
 * otherwise duplicated across the lesson specs: it seeds localStorage via the
 * `createPageWithStorage` fixture factory and clicks through the resume screen.
 * Only synchronizes; feature assertions belong in the spec.
 *
 * @param createPageWithStorage The fixture factory that opens a page with
 *   seeded localStorage.
 * @param storage The localStorage entries to seed (e.g. `lastAchievedLesson`).
 * @returns The page plus the resume and lesson handles the next step needs.
 */
export async function startSeededLesson(
  createPageWithStorage: (storage: Record<string, string>) => Promise<Page>,
  storage: Record<string, string>,
): Promise<SeededLesson> {
  const page = await createPageWithStorage(storage)
  const resumePage = new ResumePage(page)
  const lessonPage = new LessonPage(page)

  await resumePage.clickLetsDoIt()

  return { page, resumePage, lessonPage }
}
