describe('E2E Frontend - Auth e Tarefas', () => {
  
  it('deve registrar e logar ', () => {
    const email = `front${Date.now()}@teste.com`;
    // Acesse a página de registro
    cy.visit('http://localhost:5173/register');
    cy.get('input[type="text"]').type('Usuário Frontend Cypress');
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type('Teste123@');
    cy.get('button[type="submit"]').click();
 // Verifica se aparece a mensagem de sucesso
    cy.contains('Cadastro realizado com sucesso! Redirecionando para login...').should('be.visible');


    // Redireciona para login (ajuste se necessário)
    cy.url().should('include', '/login');
    cy.get('input[type="email"]').type('front@teste.com');
    cy.get('input[type="password"]').type('123456');
    cy.get('button[type="submit"]').click();

    // Deve estar logado e na tela de tarefas
    cy.url().should('include', '/tasks');


  });

  it('deve criar uma tarefa pelo frontend', () => {
    /// Acesse a página de registro
    const email = `front${Date.now()}@teste.com`;
    cy.visit('http://localhost:5173/register');
    cy.get('input[type="text"]').type('Usuário Frontend Cypress');
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type('Teste123@');
    cy.get('button[type="submit"]').click();
 // Verifica se aparece a mensagem de sucesso
    cy.contains('Cadastro realizado com sucesso! Redirecionando para login...').should('be.visible');


    // Redireciona para login (ajuste se necessário)
    cy.url().should('include', '/login');
    cy.get('input[type="email"]').type('front@teste.com');
    cy.get('input[type="password"]').type('123456');
    cy.get('button[type="submit"]').click();

    // Deve estar logado e na tela de tarefas
    cy.url().should('include', '/tasks');

    // Cria uma tarefa
    cy.get('a[href="/tasks/create"]').click();
    cy.get('input#title').type('Tarefa Front Cypress');
    cy.get('textarea#description').type('Descrição pelo Cypress');
    cy.get('button[type="submit"]').click();

    // Verifica se a tarefa aparece na lista
    cy.contains('Tarefa Front Cypress').should('exist');
    cy.contains('Descrição pelo Cypress').should('exist');
  });
});

