import { gql } from "graphql-request";

export const GET_POKEMON_LIST = gql`
  query GetPokemonList($limit: Int!, $offset: Int!, $where: pokemon_v2_pokemon_bool_exp) {
    pokemon_v2_pokemon(
      limit: $limit
      offset: $offset
      where: $where
      order_by: { id: asc }
    ) {
      id
      name
      pokemon_v2_pokemontypes {
        pokemon_v2_type {
          name
        }
      }
      pokemon_v2_pokemonsprites {
        sprites
      }
    }
  }
`;

export const GET_RANDOM_POKEMON = gql`
  query GetRandomPokemon($limit: Int!, $offset: Int!) {
    pokemon_v2_pokemon(limit: $limit, offset: $offset, order_by: { id: asc }) {
      id
      name
      pokemon_v2_pokemontypes {
        pokemon_v2_type {
          name
        }
      }
      pokemon_v2_pokemonsprites {
        sprites
      }
    }
  }
`;
