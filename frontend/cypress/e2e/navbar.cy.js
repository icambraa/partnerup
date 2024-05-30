// cypress/e2e/navbar.cy.ts

describe('Navbar Component', () => {
  const testUser = {
    email: 'testuser1@example.com',
    password: 'Password123!',
    riotNickname: 'Yojimbo61#EUW',
  };

  const fakeMessage = {
    id: 1,
    senderId: 'fakeSenderId',
    receiverId: testUser.riotNickname,
    messageText: 'Hola, este es un mensaje de prueba.',
    createdAt: new Date().toISOString(),
    read: false,
    anuncioId: 123,
    isAcceptanceMessage: false
  };

  const fakeUserProfile = {
    riotnickname: 'fakeSender#1234',
    admin: false
  };

  beforeEach(() => {
    cy.visit('http://localhost:3000/login');
    cy.get('input[placeholder="Email"]').type(testUser.email);
    cy.get('input[placeholder="Contraseña"]').type(testUser.password);
    cy.get('button').contains('Iniciar sesión').click();
    cy.url().should('include', '/board');

    cy.intercept('GET', 'http://localhost:8080/api/mensajes/unread?userId=*', {
      statusCode: 200,
      body: [fakeMessage],
    }).as('getUnreadMessages');

    cy.intercept('GET', 'http://localhost:8080/api/profiles/by-firebaseUid?firebaseUid=fakeSenderId', {
      statusCode: 200,
      body: fakeUserProfile,
    }).as('getUserProfile');
  });

  it('should render the navbar correctly', () => {
    cy.get('nav.navbar').should('be.visible');
    cy.get('nav.navbar img[alt="Logo"]').should('be.visible');
    cy.get('input[placeholder="Nickname#Tag"]').should('be.visible');
    cy.get('img[alt="LoL Icon"]').should('be.visible');
  });

  it('should search for a user profile', () => {
    const searchTerm = 'noo#peru';

    cy.get('input[placeholder="Nickname#Tag"]').type(searchTerm);
    cy.get('button').find('i.bi-search').click();
    cy.url().should('include', `/profile/${encodeURIComponent(searchTerm)}`);
  });

  it('should open and close the sidebar', () => {
    cy.get('i.bi-chat-left-dots-fill').click();
    cy.get('#sidebar').should('have.css', 'right', '0px');

    cy.get('i.bi-chat-left-dots-fill').click();
    cy.get('#sidebar').should('have.css', 'right', '-275px');
  });

  it('should open the message modal and mark message as read', () => {
    cy.get('i.bi-chat-left-dots-fill').click();
    cy.wait('@getUnreadMessages');
    cy.get('#sidebar li.message').first().click();
    cy.get('.modal-content').should('be.visible');
    cy.get('button').contains('Cerrar').click();
    cy.get('.modal-content').should('not.exist');
  });

  it('should send an acceptance message', () => {
    cy.get('i.bi-chat-left-dots-fill').click();
    cy.wait('@getUnreadMessages');
    cy.get('#sidebar li.message').first().click();
    cy.get('.modal-content').should('be.visible');
    cy.get('button').contains('Aceptar').click();
    cy.get('.modal-content').should('not.exist');
  });

  it('should reject a message', () => {
    cy.get('i.bi-chat-left-dots-fill').click();
    cy.wait('@getUnreadMessages');
    cy.get('#sidebar li.message').first().click();
    cy.get('.modal-content').should('be.visible');
    cy.get('button').contains('Rechazar').click();
    cy.get('.modal-content').should('not.exist');
  });
});
