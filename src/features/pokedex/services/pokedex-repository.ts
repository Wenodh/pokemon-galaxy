import { graphqlClient } from "@/lib/api/graphql-client";
import { GET_POKEMON_LIST, GET_RANDOM_POKEMON } from "../api/queries";
import {
  Pokemon,
  PokemonListItem,
  PokemonListResponse,
  PokedexFilters,
  PokemonBoolExp,
} from "../types";

export class PokedexRepository {
  private static mapPokemonToListItem(pokemon: Pokemon): PokemonListItem {
    // Extract official artwork from the JSON sprites if available
    let image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

    try {
      const spritesData = pokemon.pokemon_v2_pokemonsprites?.[0]?.sprites;
      if (spritesData) {
        const parsed =
          typeof spritesData === "string" ? JSON.parse(spritesData) : spritesData;
        const artwork = parsed?.other?.["official-artwork"]?.front_default;
        if (artwork) {
          image = artwork;
        }
      }
    } catch (e) {
      console.warn(`Failed to parse sprites for pokemon ${pokemon.id}`, e);
    }

    return {
      id: pokemon.id,
      name: pokemon.name,
      types: pokemon.pokemon_v2_pokemontypes?.map((t) => t.pokemon_v2_type.name) || [],
      image,
    };
  }

  /**
   * Fetches a paginated list of Pokemon, supporting search by name or ID.
   */
  static async getPokemonList(
    limit: number = 20,
    offset: number = 0,
    filters: PokedexFilters = {}
  ): Promise<PokemonListItem[]> {
    const { search } = filters;
    let where: PokemonBoolExp = {};

    if (search) {
      const isNumeric = /^\d+$/.test(search);
      if (isNumeric) {
        where = { id: { _eq: parseInt(search, 10) } };
      } else {
        where = { name: { _ilike: `%${search}%` } };
      }
    }

    try {
      const data = await graphqlClient.request<PokemonListResponse>(
        GET_POKEMON_LIST,
        {
          limit,
          offset,
          where,
        }
      );

      return data?.pokemon_v2_pokemon?.map((p) => this.mapPokemonToListItem(p)) || [];
    } catch (error) {
      console.error("PokedexRepository.getPokemonList error:", error);
      return [];
    }
  }

  /**
   * Fetches random featured Pokemon by using a random offset.
   */
  static async getFeaturedPokemon(limit: number = 6): Promise<PokemonListItem[]> {
    const maxOffset = 1000 - limit;
    const randomOffset = Math.floor(Math.random() * maxOffset);

    try {
      const data = await graphqlClient.request<PokemonListResponse>(
        GET_RANDOM_POKEMON,
        {
          limit,
          offset: randomOffset,
        }
      );

      return data?.pokemon_v2_pokemon?.map((p) => this.mapPokemonToListItem(p)) || [];
    } catch (error) {
      console.error("PokedexRepository.getFeaturedPokemon error:", error);
      return [];
    }
  }
}
