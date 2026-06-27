export const API_CONFIG = {
  endpoint: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "https://beta.pokeapi.co/graphql/v1beta",
  timeout: 10000,
};

export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || "Pokemon Galaxy",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
};
