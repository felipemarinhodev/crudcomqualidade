const BASE_URL = "http://localhost:3000";

describe("/ - Todos feed", () => {
  it("when load, renders the page", () => {
    cy.visit(BASE_URL);
  });
  it("When create a new todo, it must appears in the screen", () => {
    // 1 - Interceptações/Interceptação
    cy.intercept("POST", `${BASE_URL}/api/todos`, (request) => {
      request.reply({
        statusCode: 201,
        body: {
          todo: {
            id: "91289483-7dcc-4b4d-9608-1b7cb5ca21ee",
            content: "Test Todo",
            date: "2023-05-18T05:42:29.219Z",
            done: false,
          },
        },
      });
    }).as("createTodo");
    // 2 - Abrir a página
    cy.visit(BASE_URL);
    // 3 - Selecionar o input de criar nova todo
    // 4 - Digitar no input de criar nova todo
    const inputAddTodo = "input[name='add-todo']";
    cy.get(inputAddTodo).type("Test Todo");
    // 5 - Clicar no botão
    const buttonAddTodo = "[aria-label='Adicionar novo item']";
    cy.get(buttonAddTodo).click();
    // 6 - Checar se na página surgiu um novo elemento
    cy.get("table > tbody").contains("Test Todo");
  });
});
