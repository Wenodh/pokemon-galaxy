import { GraphQLClient } from "graphql-request";
import { API_CONFIG } from "./config";

export const graphqlClient = new GraphQLClient(API_CONFIG.endpoint, {
  headers: {
    "Content-Type": "application/json",
  },
});
