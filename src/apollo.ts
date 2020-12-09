import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { TOKEN_NAME } from "./gloabl.constant";

export const getLSToken = () => localStorage.getItem(TOKEN_NAME);

export const isLoggedInVar = makeVar(Boolean(getLSToken()));
export const authTokenVar = makeVar(getLSToken());

const httpLink = createHttpLink({
  uri: "http://lednas.yoyang.io:32789/graphql",
});

const authLink = setContext((request, prevContext) => {
  return {
    headers: {
      ...prevContext.headers,
      "x-jwt": authTokenVar() || "",
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          isLoggedIn: {
            read(existing, options) {
              return isLoggedInVar();
            },
          },
          token: {
            read() {
              return authTokenVar();
            },
          },
        },
      },
    },
  }),
});
