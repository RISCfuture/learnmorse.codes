import { repeat } from 'lodash-es'

describe('Lesson', () => {
  context('Testing to completion', () => {
    it('fails a lesson', () => {
      cy.visit('/')
      cy.findByText('OK, I guess').click()

      cy.findByTestId('symbolKey-k').should('have.class', 'hover')
      cy.findByTestId('symbolKey-m').should('have.class', 'hover')

      cy.findByText('Get ready...').should('exist')
      cy.findByText('Start typing!').should('exist')

      cy.testInput((answer) => `${repeat('a', answer.length)}{enter}`)
      cy.findByText('Pencils down!').should('exist')

      cy.findByTestId('score').shouldHaveText('0%')
    })

    it('completes a lesson', () => {
      cy.visit('/')
      cy.findByText('OK, I guess').click()

      cy.findByTestId('symbolKey-k', { timeout: 10000 }).should('have.class', 'hover')
      cy.findByTestId('symbolKey-m').should('have.class', 'hover')

      cy.findByText('Get ready...').should('exist')
      cy.findByText('Start typing!').should('exist')

      cy.testInput((answer) => `${answer.replace(/ /g, '')}o{enter}`)
      cy.findByText('Pencils down!').should('exist')

      cy.findByTestId('score').shouldMatchText(/9\d%/)
    })

    it('gets extra credit', () => {
      cy.setLocalStorage('lastAchievedLesson', '0')
      cy.visit('/')
      cy.findByText('Let’s do it').click()

      cy.findByTestId('symbolKey-r', { timeout: 10000 }).should('have.class', 'hover')

      cy.findByText('Get ready...').should('exist')
      cy.findByText('Start typing!').should('exist')

      cy.testInput((answer) => `${answer}o{enter}`)
      cy.findByText('Pencils down!').should('exist')

      cy.findByTestId('score').shouldMatchText(/9\d%/)
      cy.findByTestId('extraCredit').shouldMatchText(
        /^\.\.\.plus (an|\d+) extra points? for typing those spaces!$/
      )
    })

    it('gets a perfect score', () => {
      cy.clearLocalStorage()
      cy.setLocalStorage('lastAchievedLesson', '1')
      cy.visit('/')
      cy.findByText('Let’s do it').click()

      cy.findByTestId('symbolKey-s', { timeout: 10000 }).should('have.class', 'hover')

      cy.findByText('Get ready...').should('exist')
      cy.findByText('Start typing!').should('exist')

      cy.testInput((answer) => `${answer}{enter}`)
      cy.findByText('Pencils down!').should('exist')

      cy.findByTestId('score').shouldHaveText('100%')
    })
  })

  context('Other testing', () => {
    it('times out a lesson', () => {
      cy.clearLocalStorage()
      cy.setLocalStorage('lastAchievedLesson', '2')
      cy.visit('/')
      cy.findByText('Let’s do it').click()

      cy.findByTestId('symbolKey-u', { timeout: 10000 }).should('have.class', 'hover')

      cy.findByText('Get ready...').should('exist')
      cy.findByText('Start typing!').should('exist')

      cy.findByText('Did it get away from you?', { timeout: 10000 }).should('exist')
      cy.findByText('OK. Let’s go again.').click()

      cy.findByText('Get ready...').should('exist')
      cy.findByText('Start typing!').should('exist')
    })

    it('returns to a lesson', () => {
      cy.clearLocalStorage()
      cy.setLocalStorage('lastAchievedLesson', '2')
      cy.visit('/')

      cy.findByText('Ready to pick up where you left off?').should('exist')
      cy.findByText('Let’s do it').click()

      cy.findByTestId('symbolKey-u').should('have.class', 'hover')
    })

    it('moves between lessons with the arrow key', () => {
      cy.clearLocalStorage()
      cy.setLocalStorage('lastAchievedLesson', '2')
      cy.visit('/')
      cy.findByText('Let’s do it').click()

      cy.get('body').trigger('keyup', { key: 'ArrowLeft' })
      cy.findByTestId('symbolKey-s').should('have.class', 'hover')

      cy.get('body').trigger('keyup', { key: 'ArrowRight' })
      cy.findByTestId('symbolKey-u').should('have.class', 'hover')

      cy.findByText('Get ready...').should('exist')
      cy.findByText('Start typing!').should('exist')

      cy.get('body').trigger('keyup', { key: 'ArrowRight' })
      cy.findByTestId('symbolKey-a').should('have.class', 'hover')
    })
  })

  context('Completion', () => {
    it('completes the whole course', () => {
      cy.clearLocalStorage()
      cy.setLocalStorage('lastAchievedLesson', '48')
      cy.visit('/')
      cy.findByText('Let’s do it').click()

      cy.findByTestId('symbolKey-@').should('have.class', 'hover')
      cy.findByText('Get ready...', { timeout: 10000 }).should('exist')
      cy.findByText('Start typing!').should('exist')

      cy.testInput((answer) => `${answer}{enter}`)
      cy.findByText('Pencils down!').should('exist')

      cy.findByTestId('score').shouldHaveText('100%')

      cy.findByText('You did it!', { timeout: 10000 }).should('exist')
    })

    it('practices and fails', () => {
      cy.clearLocalStorage()
      cy.setLocalStorage('lastAchievedLesson', '49')
      cy.visit('/')

      cy.findByText('Practice More').should('exist')
      cy.findByText('Practice More', { timeout: 10000 }).click()

      cy.findByText('Get ready...').should('exist')
      cy.findByText('Start typing!').should('exist')

      cy.testInput((answer) => `${repeat('a', answer.length)}{enter}`)
      cy.findByText('Pencils down!').should('exist')

      cy.findByTestId('score').shouldHaveText('0%')
      cy.findByTestId('diff').should('exist')
    })

    it('practices and succeeds', () => {
      cy.clearLocalStorage()
      cy.setLocalStorage('lastAchievedLesson', '49')
      cy.visit('/')
      cy.findByText('Practice More', { timeout: 10000 }).click()

      cy.findByText('Get ready...', { timeout: 10000 }).should('exist')
      cy.findByText('Start typing!').should('exist')

      cy.testInput((answer) => `${answer}{enter}`)
      cy.findByText('Pencils down!').should('exist')

      cy.findByTestId('score').shouldHaveText('100%')
      cy.findByTestId('diff').should('exist')
    })

    it('restarts progress', () => {
      cy.clearLocalStorage()
      cy.setLocalStorage('lastAchievedLesson', '49')
      cy.visit('/')

      cy.findByText('Reset Progress').click()

      cy.findByText('OK, I guess').click()

      cy.findByTestId('symbolKey-k').should('have.class', 'hover')
      cy.findByTestId('symbolKey-m').should('have.class', 'hover')
    })
  })
})
