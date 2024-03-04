/// <reference types="cypress" />

/** TypeScript declarations for commands added in `commands.js`. */

declare namespace Cypress {
  interface Chainable {

    /**
     * Select a DOM element by its `data-cy` attribute.
     *
     * @param value The value for the attribute.
     * @param options Additional options to pass to `cy.get`.
     * @return The element(s) whose `data-cy` attribute matches `value`.
     */

    dataCy(
      value: string,
      options?: Partial<Loggable & Timeoutable & Withinable>
    ): Chainable<JQuery<HTMLElement>>;

    slowType(value: string): Chainable<Element>;

    testInput(answerFunction: (answer: string) => string): Chainable<Element>

    shouldHaveText(text: string): Chainable<Element>
    shouldMatchText(text: RegExp): Chainable<Element>

    setLocalStorage(key: string, value: string): Chainable<Element>
  }
}
