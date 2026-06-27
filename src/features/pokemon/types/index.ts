export interface PokemonType {
  id: number;
  name: string;
}
export interface PokemonStat {
  base_stat: number;
  pokemon_v2_stat: {
    name: string;
  };
}
export interface PokemonAbility {
  is_hidden: boolean;
  pokemon_v2_ability: {
    name: string;
    pokemon_v2_abilityeffecttexts: {
      short_effect: string;
    }[];
  };
}
export interface PokemonSprites {
  sprites: string | Record<string, unknown>;
}
export interface PokemonMove {
  level: number;
  pokemon_v2_move: {
    name: string;
    accuracy: number | null;
    power: number | null;
    pp: number | null;
    type_id: number;
    pokemon_v2_type: {
      name: string;
    };
    pokemon_v2_movedamageclass: {
      name: string;
    };
  };
  pokemon_v2_movelearnmethod: {
    name: string;
  };
}
export interface PokemonSpecies {
  id: number;
  name: string;
  generation_id: number;
  pokemon_v2_generation: {
    name: string;
  };
  pokemon_v2_evolutionchain: {
    id: number;
  };
  pokemon_v2_pokemonspeciesnames: {
    genus: string;
  }[];
  pokemon_v2_pokemonspeciesflavortexts: {
    flavor_text: string;
  }[];
}
export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  pokemon_v2_pokemontypes: {
    pokemon_v2_type: PokemonType;
  }[];
  pokemon_v2_pokemonstats: PokemonStat[];
  pokemon_v2_pokemonabilities: PokemonAbility[];
  pokemon_v2_pokemonsprites: PokemonSprites[];
  pokemon_v2_pokemonspecy: PokemonSpecies;
  pokemon_v2_pokemonmoves: PokemonMove[];
}
export interface PokemonDetailsResponse {
  pokemon_v2_pokemon: PokemonDetail[];
}
export interface EvolutionSpecies {
  id: number;
  name: string;
  evolves_from_species_id: number | null;
  pokemon_v2_pokemons: {
    id: number;
    pokemon_v2_pokemonsprites: PokemonSprites[];
  }[];
}
export interface EvolutionChainResponse {
  pokemon_v2_evolutionchain_by_pk: {
    id: number;
    pokemon_v2_pokemonspecies: EvolutionSpecies[];
  };
}
export interface Pokemon {
  id: number;
  name: string;
  pokemon_v2_pokemontypes: {
    pokemon_v2_type: {
      name: string;
    };
  }[];
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
export interface Move {
  name: string;
  accuracy: number | null;
  power: number | null;
  pp: number | null;
  type: string;
  category: string;
  learnMethod: string;
  level?: number;
}
export interface PokemonDetails {
  id: number;
  name: string;
  height: number;
  weight: number;
  baseExperience: number;
  types: string[];
  typeIds: number[];
  stats: {
    name: string;
    value: number;
  }[];
  abilities: {
    name: string;
    isHidden: boolean;
    description: string;
  }[];
  image: string;
  genus: string;
  generation: string;
  generationId: number;
  flavorText: string;
  evolutionChainId: number;
  moves: Move[];
}
export interface EvolutionNode {
  id: number;
  name: string;
  image: string;
  evolvesFromId: number | null;
  children: EvolutionNode[];
}
