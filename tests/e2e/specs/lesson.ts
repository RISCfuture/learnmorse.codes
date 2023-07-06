import { repeat } from 'lodash-es'

describe('Lesson', () => {
  context('Testing to completion', () => {
    it('fails a lesson', () => {
      cy.visit('/')
      cy.dataCy('getStartedButton').click()

      cy.dataCy('symbolKey-k').should('have.class', 'hover')
      cy.dataCy('symbolKey-m').should('have.class', 'hover')

      cy.dataCy('getReady').should('exist')
      cy.dataCy('startTyping').should('exist')

      cy.testInput(answer => `${repeat('a', answer.length)}{enter}`)
      cy.dataCy('pencilsDown').should('exist')

      cy.dataCy('score').shouldHaveText('0%')
    })

    it('completes a lesson', () => {
      cy.visit('/')
      cy.dataCy('getStartedButton').click()

      cy.dataCy('symbolKey-k', { timeout: 10000 }).should('have.class', 'hover')
      cy.dataCy('symbolKey-m').should('have.class', 'hover')

      cy.dataCy('getReady').should('exist')
      cy.dataCy('startTyping').should('exist')

      cy.testInput(answer => `${answer.replace(/ /g, '')}o{enter}`)
      cy.dataCy('pencilsDown').should('exist')

      cy.dataCy('score').shouldMatchText(/9\d%/)
    })

    it('gets extra credit', () => {
      cy.setLocalStorage('lastAchievedLesson', '0')
      cy.visit('/')
      cy.dataCy('resumeButton').click()

      cy.dataCy('symbolKey-r', { timeout: 10000 }).should('have.class', 'hover')

      cy.dataCy('getReady').should('exist')
      cy.dataCy('startTyping').should('exist')

      cy.testInput(answer => `${answer}o{enter}`)
      cy.dataCy('pencilsDown').should('exist')

      cy.dataCy('score').shouldMatchText(/9\d%/)
      cy.dataCy('extraCredit').shouldMatchText(/^\.\.\.plus (an|\d+) extra points? for typing those spaces!$/)
    })

    it('gets a perfect score', () => {
      cy.clearLocalStorage()
      cy.setLocalStorage('lastAchievedLesson', '1')
      cy.visit('/')
      cy.dataCy('resumeButton').click()

      cy.dataCy('symbolKey-s', { timeout: 10000 }).should('have.class', 'hover')

      cy.dataCy('getReady').should('exist')
      cy.dataCy('startTyping').should('exist')

      cy.testInput(answer => `${answer}{enter}`)
      cy.dataCy('pencilsDown').should('exist')

      cy.dataCy('score').shouldHaveText('100%')
    })
  })

  context('Other testing', () => {
    it('times out a lesson', () => {
      cy.clearLocalStorage()
      cy.setLocalStorage('lastAchievedLesson', '2')
      cy.visit('/')
      cy.dataCy('resumeButton').click()

      cy.dataCy('symbolKey-u', { timeout: 10000 }).should('have.class', 'hover')

      cy.dataCy('getReady').should('exist')
      cy.dataCy('startTyping').should('exist')

      cy.dataCy('abandoned', { timeout: 10000 }).should('exist')
      cy.dataCy('retryButton').click()

      cy.dataCy('getReady').should('exist')
      cy.dataCy('startTyping').should('exist')
    })

    it('returns to a lesson', () => {
      cy.clearLocalStorage()
      cy.setLocalStorage('lastAchievedLesson', '2')
      cy.visit('/')

      cy.dataCy('resume').should('exist')
      cy.dataCy('resumeButton').click()

      cy.dataCy('symbolKey-u').should('have.class', 'hover')
    })

    it('moves between lessons with the arrow key', () => {
      cy.clearLocalStorage()
      cy.setLocalStorage('lastAchievedLesson', '2')
      cy.visit('/')
      cy.dataCy('resumeButton').click()

      cy.get('body').trigger('keyup', { key: 'ArrowLeft' })
      cy.dataCy('symbolKey-s').should('have.class', 'hover')

      cy.get('body').trigger('keyup', { key: 'ArrowRight' })
      cy.dataCy('symbolKey-u').should('have.class', 'hover')

      cy.dataCy('getReady').should('exist')
      cy.dataCy('startTyping').should('exist')

      cy.get('body').trigger('keyup', { key: 'ArrowRight' })
      cy.dataCy('symbolKey-a').should('have.class', 'hover')
    })
  })

  context('Completion', () => {
    it('completes the whole course', () => {
      cy.clearLocalStorage()
      cy.setLocalStorage('lastAchievedLesson', '48')
      cy.visit('/')
      cy.dataCy('resumeButton').click()

      cy.dataCy('symbolKey-@').should('have.class', 'hover')
      cy.dataCy('getReady', { timeout: 10000 }).should('exist')
      cy.dataCy('startTyping').should('exist')

      cy.testInput(answer => `${answer}{enter}`)
      cy.dataCy('pencilsDown').should('exist')

      cy.dataCy('score').shouldHaveText('100%')

      cy.dataCy('completed', { timeout: 10000 }).should('exist')
    })

    it('practices and fails', () => {
      cy.clearLocalStorage()
      cy.setLocalStorage('lastAchievedLesson', '49')
      cy.visit('/')

      cy.dataCy('practiceButton').should('exist')
      cy.dataCy('practiceButton', { timeout: 10000 }).click()

      cy.dataCy('getReady').should('exist')
      cy.dataCy('startTyping').should('exist')

      cy.testInput(answer => `${repeat('a', answer.length)}{enter}`)
      cy.dataCy('pencilsDown').should('exist')

      cy.dataCy('score').shouldHaveText('0%')
      cy.dataCy('diff').should('exist')
    })

    it('practices and succeeds', () => {
      cy.clearLocalStorage()
      cy.setLocalStorage('lastAchievedLesson', '49')
      cy.visit('/')
      cy.dataCy('practiceButton', { timeout: 10000 }).click()

      cy.dataCy('getReady', { timeout: 10000 }).should('exist')
      cy.dataCy('startTyping').should('exist')

      cy.testInput(answer => `${answer}{enter}`)
      cy.dataCy('pencilsDown').should('exist')

      cy.dataCy('score').shouldHaveText('100%')
      cy.dataCy('diff').should('exist')
    })

    it('restarts progress', () => {
      cy.clearLocalStorage()
      cy.setLocalStorage('lastAchievedLesson', '49')
      cy.visit('/')

      cy.dataCy('resetButton').click()

      cy.dataCy('getStartedButton').click()

      cy.dataCy('symbolKey-k').should('have.class', 'hover')
      cy.dataCy('symbolKey-m').should('have.class', 'hover')
    })
  })
})
