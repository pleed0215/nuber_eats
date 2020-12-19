describe("Create Account", () => {
  const user = cy;
  const titleMaker = (title: string):string => `${title} | Nuber eats`;
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
    
    
    user.intercept("http://lednas.yoyang.io:32789/graphql", (req) => {
      const { operationName } = req.body;
      if (operationName === "CreateUser") {
      req.reply( res => {
        res.send({
          fixture: "auth/create_account.json"
        });
      });
      }
    });
    user.visit("/");
    user.findByText(/create/i).click();

    user.findByPlaceholderText(/email/i).type("email3@test.test");
    user
      .findByPlaceholderText(/password/i)
      .type("testpassword")
      .blur();
    user.findByRole("button").click();
    user.wait(1000);
    // @ts-ignore
    user.login('email3@test.test', 'testpassword');
  });
});
