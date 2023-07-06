// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import {trim} from "lodash-es"

Cypress.Commands.add('dataCy', (value, options) =>
  cy.get(`[data-cy=${CSS.escape(value)}]`, options))

Cypress.Commands.add('testInput', (answerFunction) => {
  cy.dataCy('answerKey').invoke('val').should('not.be.empty')
  cy.dataCy('answerKey').invoke('val').then(answer => {
    cy.dataCy('testInput').type(answerFunction(answer))
  })
})

Cypress.Commands.add('shouldHaveText', {prevSubject: 'element'}, (subject, text) => {
  cy.wrap(subject).should('not.be.empty')
  expect(trim(subject[0].textContent)).to.eql(text)
})

Cypress.Commands.add('shouldMatchText', {prevSubject: 'element'}, (subject, rx) => {
  cy.wrap(subject).should('not.be.empty')
  expect(trim(subject[0].textContent)).to.match(rx)
})

Cypress.Commands.add('setLocalStorage', (key, value) => {
  cy.window().then((win) => {
    win.localStorage.setItem(key, value)
  })
})
