import { ApolloClient, InMemoryCache, makeVar } from "@apollo/client";

export const isLoggedInVar = makeVar(false);

export const apolloClient = new ApolloClient({
  uri: "http://lednas.yoyang.io:32789/graphql",
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          isLoggedIn: {
            read(existing, options) {
              return isLoggedInVar();
            },
          },
        },
      },
    },
  }),
});
