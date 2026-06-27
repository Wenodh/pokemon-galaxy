import { GraphQLClient } from 'graphql-request';

const POKEAPI_GRAPHQL_URL = 'https://beta.pokeapi.co/graphql/v1beta1';

export const graphqlClient = new GraphQLClient(POKEAPI_GRAPHQL_URL);
