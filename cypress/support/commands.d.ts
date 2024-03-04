/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      slowType(value: string): Chainable<Element>

      testInput(answerFunction: (answer: string) => string): Chainable<Element>

      shouldHaveText(text: string): Chainable<Element>

      shouldMatchText(text: RegExp): Chainable<Element>

      setLocalStorage(key: string, value: string): Chainable<Element>
    }
  }
}

export {}
