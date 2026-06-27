import { gql } from 'graphql-request';
import { graphqlClient } from './graphql-client';

export const GET_POKEMON_LIST = gql`
  query getPokemonList($limit: Int, $offset: Int) {
    pokemon: pokemon_v2_pokemon(limit: $limit, offset: $offset, order_by: {id: asc}) {
      id
      name
      height
      weight
      pokemon_v2_pokemontypes {
        pokemon_v2_type {
          name
        }
      }
      pokemon_v2_pokemonspecy {
        pokemon_v2_generation {
          name
        }
      }
      pokemon_v2_pokemonabilities {
        pokemon_v2_ability {
          name
        }
      }
    }
  }
`;

export const GET_POKEMON_DETAILS = gql`
  query getPokemonDetails($name: String!) {
    pokemon: pokemon_v2_pokemon(where: {name: {_eq: $name}}) {
      id
      name
      height
      weight
      base_experience
      pokemon_v2_pokemontypes {
        pokemon_v2_type {
          name
        }
      }
      pokemon_v2_pokemonspecy {
        name
        gender_rate
        capture_rate
        base_happiness
        is_baby
        is_legendary
        is_mythical
        pokemon_v2_pokemoncolor {
          name
        }
        pokemon_v2_pokemonspeciesflavortexts(where: {language_id: {_eq: 9}}, limit: 1) {
          flavor_text
        }
        pokemon_v2_evolutionchain {
          pokemon_v2_pokemonspecies(order_by: {id: asc}) {
            id
            name
          }
        }
      }
      pokemon_v2_pokemonstats {
        base_stat
        pokemon_v2_stat {
          name
        }
      }
      pokemon_v2_pokemonabilities {
        is_hidden
        pokemon_v2_ability {
          name
          pokemon_v2_abilityeffecttexts(where: {language_id: {_eq: 9}}, limit: 1) {
            short_effect
          }
        }
      }
      pokemon_v2_pokemonmoves(order_by: {level: asc}) {
        level
        pokemon_v2_move {
          name
          power
          accuracy
          pp
          pokemon_v2_type {
            name
          }
          pokemon_v2_movecategory {
            name
          }
        }
      }
    }
  }
`;

export const getPokemonList = async (limit = 1000, offset = 0) => {
  return graphqlClient.request(GET_POKEMON_LIST, { limit, offset });
};

export const getPokemonDetails = async (name: string) => {
  return graphqlClient.request(GET_POKEMON_DETAILS, { name });
};
