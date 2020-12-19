describe("Edit Profile", () => {
    const user = cy;

    beforeEach(()=> {
        // @ts-ignore
        user.login("email3@test.test", "testpassword");
    })

    it("can go to /me", () => {        
        user.wait(1500);
        user.get('a[href="/me"]').click();
        user.title().should("eq", "Updating your information | Nuber eats");
    })

    it("can change email address", () => {
        user.intercept("POST", "http://lednas.yoyang.io:32789/graphql", req => {
            
            const { operationName } = req.body;
            if (operationName === "MutationUpdateProfile") {
                // @ts-ignore
                req.body?.variables.update.email = "email3@test.test";
            }
        })
        
        
        user.wait(1500);
        user.get('a[href="/me"]').click();
        user.title().should("eq", "Updating your information | Nuber eats");
        user.findByPlaceholderText(/email/i).focus().clear().type('changed@email.com');
        user.findByRole('button').click();
    })
})