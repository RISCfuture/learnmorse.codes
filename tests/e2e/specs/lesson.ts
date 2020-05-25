import { repeat } from 'lodash-es'

describe('Lesson', () => {
  context('Testing to completion', () => {
    it('fails a lesson', () => {
      cy.clearLocalStorage()
      cy.visit('/')

      cy.dataCy('getStartedButton').click()

      cy.dataCy('symbolKey-k').should('have.class', 'hover')
      cy.dataCy('symbolKey-m').should('have.class', 'hover')

      cy.dataCy('getReady').should('exist')
      cy.dataCy('startTyping').should('exist')

      cy.dataCy('answerKey').invoke('val').should('not.be.empty').
        then(answer => cy.dataCy('testInput').type(`${repeat('a', answer.length)}{enter}`))
      cy.dataCy('pencilsDown').should('exist')

      cy.dataCy('score').invoke('text').should('eql', '0%')
    })

    it('completes a lesson', () => {
      cy.dataCy('symbolKey-k', { timeout: 10000 }).should('have.class', 'hover')
      cy.dataCy('symbolKey-m').should('have.class', 'hover')

      cy.dataCy('getReady').should('exist')
      cy.dataCy('startTyping').should('exist')

      cy.dataCy('answerKey').invoke('val').should('not.be.empty').
        then(answer => cy.dataCy('testInput').type(`${answer.replace(/ /g, '')}o{enter}`))
      cy.dataCy('pencilsDown').should('exist')

      cy.dataCy('score').invoke('text').should('match', /9\d%/)
    })

    it('gets extra credit', () => {
      cy.dataCy('symbolKey-r', { timeout: 10000 }).should('have.class', 'hover')

      cy.dataCy('getReady').should('exist')
      cy.dataCy('startTyping').should('exist')

      cy.dataCy('answerKey').invoke('val').should('not.be.empty').
        then(answer => cy.dataCy('testInput').type(`${answer}o{enter}`))
      cy.dataCy('pencilsDown').should('exist')

      cy.dataCy('score').invoke('text').should('match', /9\d%/)
      cy.dataCy('extraCredit').invoke('text').should('match', /^\.\.\.plus (an|\d+) extra points? for typing those spaces!$/)
    })

    it('gets a perfect score', () => {
      cy.dataCy('symbolKey-s', { timeout: 10000 }).should('have.class', 'hover')

      cy.dataCy('getReady').should('exist')
      cy.dataCy('startTyping').should('exist')

      cy.dataCy('answerKey').invoke('val').should('not.be.empty').
        then(answer => cy.dataCy('testInput').type(`${answer}{enter}`))
      cy.dataCy('pencilsDown').should('exist')

      cy.dataCy('score').invoke('text').should('eql', '100%')
    })
  })

  context('Other testing', () => {
    it('times out a lesson', () => {
      cy.dataCy('symbolKey-u', { timeout: 10000 }).should('have.class', 'hover')

      cy.dataCy('getReady').should('exist')
      cy.dataCy('startTyping').should('exist')

      cy.dataCy('abandoned', { timeout: 10000 }).should('exist')
      cy.dataCy('retryButton').click()

      cy.dataCy('getReady').should('exist')
      cy.dataCy('startTyping').should('exist')
    })

    it('returns to a lesson', () => {
      cy.clearLocalStorage().then(ls => ls.setItem('lastAchievedLesson', '2'))
      cy.reload()

      cy.dataCy('resume').should('exist')
      cy.dataCy('resumeButton').click()

      cy.dataCy('symbolKey-u').should('have.class', 'hover')
    })

    it('moves between lessons with the arrow key', () => {
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
      cy.clearLocalStorage().then(ls => ls.setItem('lastAchievedLesson', '48'))
      cy.reload()

      cy.dataCy('resumeButton').click()

      cy.dataCy('symbolKey-@').should('have.class', 'hover')
      cy.dataCy('getReady', { timeout: 10000 }).should('exist')
      cy.dataCy('startTyping').should('exist')

      cy.dataCy('answerKey').invoke('val').should('not.be.empty').
        then(answer => cy.dataCy('testInput').type(`${answer}{enter}`))
      cy.dataCy('pencilsDown').should('exist')

      cy.dataCy('score').invoke('text').should('eql', '100%')

      cy.dataCy('completed', { timeout: 10000 }).should('exist')
    })

    it('practices and fails', () => {
      cy.dataCy('practiceButton', { timeout: 10000 }).click()

      cy.dataCy('getReady').should('exist')
      cy.dataCy('startTyping').should('exist')

      cy.dataCy('answerKey').invoke('val').should('not.be.empty').
        then(answer => cy.dataCy('testInput').type(`${repeat('a', answer.length)}{enter}`))
      cy.dataCy('pencilsDown').should('exist')

      cy.dataCy('score').invoke('text').should('eql', '0%')
      cy.dataCy('diff').should('exist')
    })

    it('practices and succeeds', () => {
      cy.dataCy('getReady', { timeout: 10000 }).should('exist')
      cy.dataCy('startTyping').should('exist')

      cy.dataCy('answerKey').invoke('val').should('not.be.empty').
        then(answer => cy.dataCy('testInput').type(`${answer}{enter}`))
      cy.dataCy('pencilsDown').should('exist')

      cy.dataCy('score').invoke('text').should('eql', '100%')
      cy.dataCy('diff').should('exist')
    })

    it('restarts progress', () => {
      cy.clearLocalStorage().then(ls => ls.setItem('lastAchievedLesson', '49'))
      cy.reload()

      cy.dataCy('resetButton').click()

      cy.dataCy('getStartedButton').click()

      cy.dataCy('symbolKey-k').should('have.class', 'hover')
      cy.dataCy('symbolKey-m').should('have.class', 'hover')
    })
  })
})
