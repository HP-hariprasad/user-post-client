import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  split,
  HttpLink,
} from "@apollo/client/core";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { setContext } from "@apollo/client/link/context";

const environment = "development";
const configurations = {
  production: { ssl: true, hostname: "example.com", port: 443 },
  development: { ssl: true, hostname: "localhost", port: 4000 },
};
const config = configurations[environment];

const httpLink = new HttpLink({
  uri: `https://${config.hostname}:${config.port}/graphql`,
  credentials: "include",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("authToken");
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: `wss://${config.hostname}:${config.port}/graphql`,
    connectionParams: () => {
      const token = localStorage.getItem("authToken");
      return {
        Authorization: token ? `Bearer ${token}` : "",
      };
    },
    retryAttempts: 3,
    lazy: true,
  })
);

const httpWithAuthLink = ApolloLink.from([authLink, httpLink]);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpWithAuthLink
);

const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default apolloClient;
