import { GraphQLClient } from "graphql-request";

const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "https://graphql.pokeapi.co/v1beta2";

export const graphqlClient = new GraphQLClient(endpoint, {
  headers: {
    "Content-Type": "application/json",
  },
});
