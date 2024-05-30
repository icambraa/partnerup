describe('Board Component', () => {
  const testUser = {
    email: 'testuser@example.com',
    password: 'Password123!',
  };

  const generateUniqueAnuncio = (rol = 'Mid') => {
    const timestamp = Date.now();
    return {
      riotNickname: `${testUser.riotNickname}_${timestamp}`,
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

    // Asegúrate de que el modal esté completamente visible
    cy.get('.modal-content').should('be.visible');

    cy.get('.modal-content').within(() => {
      // El riotNickname ya está asignado a la cuenta, por lo que no lo ingresamos
      cy.get('select#rol').select(newAnuncio.rol);
      cy.get('select#buscaRol').select(newAnuncio.buscaRol);
      cy.get('select#rango').select(newAnuncio.rango, { force: true });
      cy.get('textarea#comentario').type(newAnuncio.comentario);

      // Verifica que el botón "Enviar" esté visible antes de hacer clic en él
      cy.get('button').contains('Enviar').should('be.visible').click();
    });

    // Esperar a que aparezca el modal de éxito y luego cerrarlo
    cy.get('.modal-content').contains('Canal del Anuncio').should('be.visible');
    cy.get('.modal-content').within(() => {
      cy.get('button').contains('Cerrar').click();
    });

    // Verificar la presencia de la imagen del rol
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

    // Crear un anuncio con el rol "Top"
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

    // Filtrar anuncios por el rol "Top"
    cy.get('.top-icon').click();
    cy.get('.custom-table').within(() => {
      cy.get(`img[src="${roleImageUrls.Top}"]`, { timeout: 10000 }).should('be.visible');
    });
  });

  it('should open the message modal and send a message', () => {
    const messageText = 'Hola, estoy interesado en tu anuncio.';

    cy.visit('http://localhost:3000/board');
    cy.get('.custom-table tbody tr').not(`:contains("${testUser.riotNickname}")`).first().within(() => {
      cy.get('button').find('i.bi-envelope-fill').first().click();
    });

    cy.get('.modal-content').should('be.visible');
    cy.get('textarea#messageText').type(messageText);
    cy.get('button').contains('Enviar').click();

    cy.get('.modal-content').should('not.exist');
  });

  it('should open the report modal and submit a report', () => {
    const reportMessage = 'Este anuncio viola las reglas.';

    cy.visit('http://localhost:3000/board');
    cy.get('.custom-table tbody tr').not(`:contains("${testUser.riotNickname}")`).first().within(() => {
      cy.get('a.text-muted').click(); // Abre el menú desplegable
    });

    cy.get('.custom-table tbody tr').not(`:contains("${testUser.riotNickname}")`).first().within(() => {
      cy.get('a.dropdown-item').contains('Reportar').click(); // Encuentra y haz clic en el botón "Reportar"
    });

    cy.get('.modal-content').should('be.visible');
    cy.get('textarea#reportMessage').type(reportMessage);
    cy.get('button').contains('Enviar').click();

    cy.get('.modal-content').should('not.exist');
  });

  it('should handle pagination controls', () => {
    cy.visit('http://localhost:3000/board');
    cy.get('.pagination-controls button').click();
    cy.get('.custom-table').should('not.be.empty');
  });
});
