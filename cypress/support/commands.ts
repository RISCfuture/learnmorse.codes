/// <reference types="cypress" />

import { toString, trim } from 'lodash-es'
import '@testing-library/cypress/add-commands'

Cypress.Commands.add('testInput', (answerFunction: (answer: string) => string) => {
  cy.findByTestId('answerKey').invoke('val').should('not.be.empty')
  cy.findByTestId('answerKey')
    .invoke('val')
    .then((answer) => {
      cy.findByRole('textbox').type(answerFunction(toString(answer)))
    })
})

Cypress.Commands.add('shouldHaveText', { prevSubject: 'element' }, (subject, text: string) => {
  cy.wrap(subject).should('not.be.empty')
  expect(trim(subject[0].textContent ?? '')).to.eql(text)
})

Cypress.Commands.add('shouldMatchText', { prevSubject: 'element' }, (subject, rx: RegExp) => {
  cy.wrap(subject).should('not.be.empty')
  expect(trim(subject[0].textContent ?? '')).to.match(rx)
})

Cypress.Commands.add('setLocalStorage', (key: string, value: string) => {
  cy.window().then((win) => {
    win.localStorage.setItem(key, value)
  })
})
