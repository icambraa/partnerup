// cypress/e2e/welcome.cy.ts

describe('Welcome Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000'); // Asegúrate de que esta URL es correcta
  });

  it('should display the welcome logo', () => {
    cy.get('img[alt="Logo de Partner UP!"]').should('be.visible');
  });

  it('should navigate to the registration page when the registration button is clicked', () => {
    cy.get('a[href="/registration"]').first().should('be.visible').click();
    cy.url().should('include', '/registration');
    cy.go('back');
  });

  it('should scroll to the "What is Partner UP" section when the button is clicked', () => {
    cy.contains('¿Qué es Partner UP!?').click();
    cy.get('h2').contains('¿Qué es Partner UP!?').should('be.visible');
  });

  it('should display game logos', () => {
    cy.contains('¿Qué es Partner UP!?').click(); // Ensure section is visible
    cy.get('img[alt="League of Legends"]').should('be.visible');
    cy.get('img[alt="Valorant"]').should('be.visible');
  });

  it('should have working login link in the text', () => {
    cy.contains('¿Ya tienes una cuenta?').within(() => {
      cy.get('a[href="/login"]').should('be.visible').click();
      cy.url().should('include', '/login');
    });
  });

  it('should display footer correctly', () => {
    cy.get('footer').should('be.visible').contains('Partner UP! - Todos los derechos reservados.');
  });
});
