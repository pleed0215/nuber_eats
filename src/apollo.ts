import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { BASE_ENDPOINT, TOKEN_NAME } from "./gloabl.constant";
import { WebSocketLink } from "@apollo/client/link/ws";
//import { SubscriptionClient } from "subscriptions-transport-ws";
import { getMainDefinition } from "@apollo/client/utilities";

export const getLSToken = () => localStorage.getItem(TOKEN_NAME);

export const isLoggedInVar = makeVar(Boolean(getLSToken()));
export const authTokenVar = makeVar(getLSToken());

//const BASE_ENDPOINT = "lednas.yoyang.io:32789/graphql";
//const BASE_ENDPOINT = "my.yoyang.io:32788/graphql";

const HTTP_ENDPOINT = `https://${BASE_ENDPOINT}`;
//const WS_ENDPOINT = `ws://${BASE_ENDPOINT}`;
const WS_ENDPOINT = `wss://${BASE_ENDPOINT}`;

const httpLink = createHttpLink({
  uri: HTTP_ENDPOINT,
  //uri: "http://localhost:4000/graphql",
});

const wsLink = new WebSocketLink({
  uri: WS_ENDPOINT,
  options: {
    reconnect: true,
    connectionParams: {
      "x-jwt": authTokenVar() || "",
    },
  },
});

const authLink = setContext((request, prevContext) => {
  return {
    headers: {
      ...prevContext.headers,
      "x-jwt": authTokenVar() || "",
    },
  };
});
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

export const apolloClient = new ApolloClient({
  link: splitLink,
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
