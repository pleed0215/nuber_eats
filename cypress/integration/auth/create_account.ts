describe("Create Account", () => {
  const user = cy;
  it("should see email validation error.", () => {
    user.visit("/");
    user.findByText(/create/i).click();

    user.findByPlaceholderText(/email/i).type("wrong_email@test");
    user.findByPlaceholderText(/password/i).type("testtest1234");

    user
      .get(".auth__form_error")
      .should("have.text", "Please input email address.");
  });
  it("should see password validation error.", () => {
    user.visit("/");
    user.findByText(/create/i).click();

    user.findByPlaceholderText(/email/i).type("email@test.com");
    user
      .findByPlaceholderText(/password/i)
      .type("1234")
      .blur();
    user.findByRole("button");
    user
      .get(".auth__form_error")
      .should("have.text", "Password too short, must be over 8");
  });
  it("should create accound and can login", () => {
    user.visit("/");
    user.findByText(/create/i).click();

    user.findByPlaceholderText(/email/i).type("email2@test.test");
    user
      .findByPlaceholderText(/password/i)
      .type("testpassword")
      .blur();
    user.findByRole("button").click();
    user.wait(5000);
    cy.findByPlaceholderText(/email/i).type("email2@test.test");
    cy.findByPlaceholderText(/password/i).type("testpassword");
    cy.findByRole("button").should("not.have.a.property", "disabled");
    cy.findByRole("button").click();
    cy.window().its("localStorage.nuber_token").should("be.a", "string");
  });
});
