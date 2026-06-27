import { gql } from "graphql-request";
export const GET_POKEMON_DETAILS = gql`
  query GetPokemonDetails($name: String!) {
    pokemon_v2_pokemon(where: { name: { _eq: $name } }) {
      id
      name
      height
      weight
      base_experience
      pokemon_v2_pokemontypes {
        pokemon_v2_type {
          id
          name
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
          pokemon_v2_abilityeffecttexts(where: { language_id: { _eq: 9 } }) {
            short_effect
          }
        }
      }
      pokemon_v2_pokemonsprites {
        sprites
      }
      pokemon_v2_pokemonspecy {
        id
        name
        generation_id
        pokemon_v2_generation {
          name
        }
        pokemon_v2_evolutionchain {
          id
        }
        pokemon_v2_pokemonspeciesnames(where: { language_id: { _eq: 9 } }) {
          genus
        }
        pokemon_v2_pokemonspeciesflavortexts(
          where: { language_id: { _eq: 9 } }
          order_by: { version_id: desc }
          limit: 1
        ) {
          flavor_text
        }
      }
      pokemon_v2_pokemonmoves(order_by: { level: asc }) {
        level
        pokemon_v2_move {
          name
          accuracy
          power
          pp
          type_id
          pokemon_v2_type {
            name
          }
          pokemon_v2_movedamageclass {
            name
          }
        }
        pokemon_v2_movelearnmethod {
          name
        }
      }
    }
  }
`;
export const GET_EVOLUTION_CHAIN = gql`
  query GetEvolutionChain($id: Int!) {
    pokemon_v2_evolutionchain_by_pk(id: $id) {
      id
      pokemon_v2_pokemonspecies {
        id
        name
        evolves_from_species_id
        pokemon_v2_pokemons {
          id
          pokemon_v2_pokemonsprites {
            sprites
          }
        }
      }
    }
  }
`;
export const GET_RELATED_POKEMON = gql`
  query GetRelatedPokemon($typeIds: [Int!], $limit: Int!) {
    pokemon_v2_pokemon(
      where: { pokemon_v2_pokemontypes: { type_id: { _in: $typeIds } } }
      limit: $limit
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
