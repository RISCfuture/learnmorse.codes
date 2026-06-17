import { expect, type Page } from '@playwright/test'
import { LessonPage } from '../pages/LessonPage'
import { ResumePage } from '../pages/ResumePage'

type StartSeededLessonOptions = {
  /** The lesson index to seed into `lastAchievedLesson` localStorage. */
  lastAchievedLesson: string
  /** Additional localStorage entries to seed before the app loads. */
  storage?: Record<string, string>
  /**
   * Whether to assert the resume page heading is visible before resuming.
   * Defaults to `false`.
   */
  expectResumeHeading?: boolean
}

/**
 * Seeds progress into a fresh page, then resumes into the lesson view.
 *
 * Composes {@link ResumePage} and {@link LessonPage} so specs don't repeat the
 * seed-then-resume construction. The only assertions performed here are
 * synchronization (resuming waits for the lesson view); feature assertions stay
 * in the spec.
 *
 * @param createPageWithStorage The fixture factory that seeds localStorage.
 * @param options The lesson seed and optional extra storage.
 * @returns The {@link LessonPage} for the resumed lesson.
 */
export async function startSeededLesson(
  createPageWithStorage: (storage: Record<string, string>) => Promise<Page>,
  { lastAchievedLesson, storage = {}, expectResumeHeading = false }: StartSeededLessonOptions,
): Promise<LessonPage> {
  const page = await createPageWithStorage({ lastAchievedLesson, ...storage })
  const resumePage = new ResumePage(page)
  const lessonPage = new LessonPage(page)

  if (expectResumeHeading) {
    await expect(resumePage.heading).toBeVisible()
  }

  await resumePage.clickLetsDoIt()

  return lessonPage
}
