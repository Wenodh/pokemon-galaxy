export interface PokemonType {
  pokemon_v2_type: {
    name: string;
  };
}

export interface PokemonSprites {
  sprites: string | Record<string, unknown>;
}

export interface Pokemon {
  id: number;
  name: string;
  pokemon_v2_pokemontypes: PokemonType[];
  pokemon_v2_pokemonsprites: PokemonSprites[];
}

export interface PokemonListResponse {
  pokemon_v2_pokemon: Pokemon[];
}

export interface PokemonListItem {
  id: number;
  name: string;
  types: string[];
  image: string;
}

export interface PokedexFilters {
  search?: string;
}

/**
 * GraphQL Filter Types for strict compliance
 */
export interface PokemonBoolExp {
  id?: { _eq?: number };
  name?: { _ilike?: string };
}
