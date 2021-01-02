module.exports = {
  client: {
    include: ["src/**/*.{tsx, ts}"],
    tagName: "gql",
    service: {
      name: "nuber-eats-backend",
      url: "https://be-nuber-eats.herokuapp.com/graphql",
      // optional headers
      headers: {
        authorization: "Bearer lkjfalkfjadkfjeopknavadf",
      },
      // optional disable SSL validation check
      skipSSLValidation: true,
    },
  },
};
