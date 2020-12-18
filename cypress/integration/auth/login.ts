const CLIENT_ID = "client@test.test";
const CLIENT_PW = "test1234";

describe("First test", () => {
  it("Should see login page", () => {
    cy.visit("/").title().should("eq", "Welcome to nuber eats | Nuber eats");
  });

  it("can fill out the form", () => {
    cy.visit("/");
    cy.findByPlaceholderText(/email/i).type(CLIENT_ID);
    cy.findByPlaceholderText(/password/i).type(CLIENT_PW);
    //cy.get(".auth__form_button")
    cy.findByRole("button").should("not.have.property", "disabled");
  });
  it("Can see email /password validation errors", () => {
    /*cy.visit("/")
      .get(":nth-child(1) > .auth__form_input")
      .type("jakljsf")
      .get(":nth-child(2) > .auth__form_input")
      .type("jflk")
      .get(".auth__form_button")
      .should("have.prop", "disabled");*/
    cy.visit("/");
    cy.findByPlaceholderText(/email/i).type("asdf");
    cy.findByPlaceholderText(/password/i).type("asdf");
    //cy.get(".auth__form_button")
    cy.findByRole("button").should("have.prop", "disabled");
  });

  it("Can log in", () => {
    /*cy.visit("/");
    cy.findByPlaceholderText(/email/i).type(CLIENT_ID);
    cy.findByPlaceholderText(/password/i).type(CLIENT_PW);
    cy.findByRole("button").should("not.have.a.property", "disabled");
    cy.findByRole("button").click();
    cy.window().its("localStorage.nuber_token").should("be.a", "string");*/
    // @ts-ignore
    cy.login(CLIENT_ID, CLIENT_PW);
  });
  
});

/*


*/
