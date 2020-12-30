module.exports = {
  client: {
    include: ["src/**/*.{tsx, ts}"],
    tagName: "gql",
    service: {
      name: "nuber-eats-backend",
      url: "http://my.yoyang.io:32788/graphql",
      // optional headers
      headers: {
        authorization: "Bearer lkjfalkfjadkfjeopknavadf",
      },
      // optional disable SSL validation check
      skipSSLValidation: true,
    },
  },
};
