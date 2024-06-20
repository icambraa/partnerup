
describe('Welcome Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('logo de bienvenida', () => {
    cy.get('img[alt="Logo de Partner UP!"]').should('be.visible');
  });

  it('navegar a la pagina de registro', () => {
    cy.get('a[href="/registration"]').first().should('be.visible').click();
    cy.url().should('include', '/registration');
    cy.go('back');
  });

  it('scrollear a la seccion correcta', () => {
    cy.contains('¿Qué es Partner UP!?').click();
    cy.get('h2').contains('¿Qué es Partner UP!?').should('be.visible');
  });

  it('mostrar logos de los juegos', () => {
    cy.contains('¿Qué es Partner UP!?').click();
    cy.get('img[alt="League of Legends"]').should('be.visible');
    cy.get('img[alt="Valorant"]').should('be.visible');
  });

  it('login link funciona correctamente', () => {
    cy.contains('¿Ya tienes una cuenta?').within(() => {
      cy.get('a[href="/login"]').should('be.visible').click();
      cy.url().should('include', '/login');
    });
  });

  it('footer', () => {
    cy.get('footer').should('be.visible').contains('Partner UP! - Todos los derechos reservados.');
  });
});
