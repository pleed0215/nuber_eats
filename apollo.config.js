module.exports = {
  client: {
    include: ["src/**/*.{tsx, ts}"],
    tagName: "gql",
    service: {
      name: "nuber-eats-backend",
      url: "http://lednas.yoyang.io:32789/graphql",
      // optional headers
      headers: {
        authorization: "Bearer lkjfalkfjadkfjeopknavadf",
      },
      // optional disable SSL validation check
      skipSSLValidation: true,
    },
  },
};
