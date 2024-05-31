describe('Board Component', () => {
  const testUser = {
    email: 'testuser1@example.com',
    password: 'Password123!',
  };

  const generateUniqueAnuncio = (rol = 'Mid') => {
    return {
      riotNickname: "Minuts#104",
      rol: rol,
      buscaRol: 'ADC',
      rango: 'Oro',
      comentario: 'Buscando duo para ranked',
    };
  };

  const roleImageUrls = {
    Mid: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-middle.png',
    Top: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-top.png',
    Jungle: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-jungle.png',
    ADC: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-bottom.png',
    Support: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-utility.png'
  };

  beforeEach(() => {
    cy.visit('http://localhost:3000/login');
    cy.get('input[placeholder="Email"]').type(testUser.email);
    cy.get('input[placeholder="Contraseña"]').type(testUser.password);
    cy.get('button').contains('Iniciar sesión').click();
    cy.url().should('include', '/board');
  });

  it('should display the board with filters and anuncios', () => {
    cy.visit('http://localhost:3000/board');
    cy.wait(2000); // Esperar un poco para que los elementos se rendericen
    cy.get('.container').should('be.visible');
    cy.get('.custom-table').should('be.visible');
    cy.get('.pagination-controls').should('be.visible');
  });

  it('should open the create anuncio modal', () => {
    cy.visit('http://localhost:3000/board');
    cy.get('button').contains('Anunciarse').click();
    cy.get('.modal-content').should('be.visible');
  });

  it('should create a new anuncio', () => {
    const newAnuncio = generateUniqueAnuncio();

    cy.visit('http://localhost:3000/board');
    cy.get('button').contains('Anunciarse').click();

    cy.get('.modal-content').should('be.visible');

    cy.get('.modal-content').within(() => {
      cy.get('select#rol').select(newAnuncio.rol);
      cy.get('select#buscaRol').select(newAnuncio.buscaRol);
      cy.get('select#rango').select(newAnuncio.rango, { force: true });
      cy.get('textarea#comentario').type(newAnuncio.comentario);
      cy.get('button').contains('Enviar').should('be.visible').click();
    });

    cy.get('.modal-content').contains('Canal del Anuncio').should('be.visible');
    cy.get('.modal-content').within(() => {
      cy.get('button').contains('Cerrar').click();
    });

    cy.get('.custom-table').within(() => {
      cy.get(`img[src="${roleImageUrls[newAnuncio.rol]}"]`, { timeout: 10000 }).should('be.visible');
    });
    cy.get('.custom-table').within(() => {
      cy.get(`img[src="${roleImageUrls[newAnuncio.buscaRol]}"]`, { timeout: 10000 }).should('be.visible');
    });
    cy.get('.custom-table').should('contain', newAnuncio.rango);
    cy.get('.custom-table').should('contain', newAnuncio.comentario);
  });

  it('should filter anuncios by role', () => {
    const topAnuncio = generateUniqueAnuncio('Top');

    cy.visit('http://localhost:3000/board');
    cy.get('button').contains('Anunciarse').click();
    cy.get('.modal-content').should('be.visible');
    cy.get('.modal-content').within(() => {
      cy.get('select#rol').select(topAnuncio.rol);
      cy.get('select#buscaRol').select(topAnuncio.buscaRol);
      cy.get('select#rango').select(topAnuncio.rango, { force: true });
      cy.get('textarea#comentario').type(topAnuncio.comentario);
      cy.get('button').contains('Enviar').should('be.visible').click();
    });
    cy.get('.modal-content').contains('Canal del Anuncio').should('be.visible');
    cy.get('.modal-content').within(() => {
      cy.get('button').contains('Cerrar').click();
    });

    cy.get('.top-icon').click();
    cy.get('.custom-table').within(() => {
      cy.get(`img[src="${roleImageUrls.Top}"]`, { timeout: 10000 }).should('be.visible');
    });
  });

  it('should handle pagination controls', () => {
    cy.visit('http://localhost:3000/board');
    cy.get('.pagination-controls button').click();
    cy.get('.custom-table').should('not.be.empty');
  });

  it('should send a message to an announcement', () => {
    const testMessage = 'Quiero jugar contigo';
    cy.visit('http://localhost:3000/board');
    cy.wait(2000);
    cy.get('.custom-table')
        .find('button .bi-envelope-fill')
        .first()
        .click();
    cy.get('[data-testid="message-modal"]').should('be.visible');
    cy.get('[data-testid="message-modal"]').within(() => {
      cy.get('[data-testid="message-textarea"]').type(testMessage);
      cy.get('[data-testid="send-message-button"]').should('be.visible').click();
    });
  });

  it('should submit a report for an announcement', () => {
    const testReportReason = 'Inappropriate content';
    cy.visit('http://localhost:3000/board');
    cy.wait(2000);
    cy.get('.custom-table tbody tr').not(':contains("Minuts#104")').first().within(() => {
      // Abre el dropdown de opciones
      cy.get('.dropdown').click();
      // Haz clic en el botón de reportar
      cy.get('.dropdown-menu').contains('Reportar').click();
    });
    cy.get('.custom-modal').should('be.visible');
    cy.get('.custom-modal').within(() => {
      cy.get('textarea#reportMessage').type(testReportReason);
      cy.get('button').contains('Enviar Reporte').should('be.visible').click();
    });
    cy.get('.custom-modal').should('not.exist');
  });
});
