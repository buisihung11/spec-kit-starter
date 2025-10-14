import { getGreeting } from '../support/app.po';

describe('newInstructionsUi-e2e', () => {
  beforeEach(() => cy.visit('/'));

  it('should display the application title', () => {
    // Verify the main heading is displayed with the correct text
    getGreeting().should('contain', 'New Instructions UI');
  });

  it('should display the microfrontend subtitle', () => {
    cy.contains('Microfrontend Remote Application').should('be.visible');
  });

  it('should display the three main cards', () => {
    cy.contains('Instructions').should('be.visible');
    cy.contains('Create New').should('be.visible');
    cy.contains('Templates').should('be.visible');
  });

  it('should have functional buttons in cards', () => {
    cy.contains('button', 'View Instructions').should('be.visible');
    cy.contains('button', 'Create').should('be.visible');
    cy.contains('button', 'Browse').should('be.visible');
  });
});
