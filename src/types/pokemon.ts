export interface PokemonV2Type {
  name: string;
}

export interface PokemonV2PokemonType {
  pokemon_v2_type: PokemonV2Type;
}

export interface PokemonV2Stat {
  name: string;
}

export interface PokemonV2PokemonStat {
  base_stat: number;
  pokemon_v2_stat: PokemonV2Stat;
}

export interface PokemonV2AbilityEffectText {
  short_effect: string;
}

export interface PokemonV2Ability {
  name: string;
  pokemon_v2_abilityeffecttexts: PokemonV2AbilityEffectText[];
}

export interface PokemonV2PokemonAbility {
  is_hidden?: boolean;
  pokemon_v2_ability: {
    name: string;
    pokemon_v2_abilityeffecttexts?: PokemonV2AbilityEffectText[];
  };
}

export interface PokemonV2Move {
  name: string;
  power: number;
  accuracy: number;
  pp: number;
  pokemon_v2_type: { name: string };
  pokemon_v2_movecategory: { name: string };
}

export interface PokemonV2PokemonMove {
  level: number;
  pokemon_v2_move: PokemonV2Move;
}

export interface PokemonV2PokemonSpeciesFlavorText {
  flavor_text: string;
}

export interface PokemonV2EvolutionChainSpecies {
  id: number;
  name: string;
}

export interface PokemonV2EvolutionChain {
  pokemon_v2_pokemonspecies: PokemonV2EvolutionChainSpecies[];
}

export interface PokemonV2PokemonSpecies {
  id: number;
  name: string;
  gender_rate: number;
  capture_rate: number;
  base_happiness: number;
  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  pokemon_v2_pokemoncolor: { name: string };
  pokemon_v2_pokemonspeciesflavortexts: PokemonV2PokemonSpeciesFlavorText[];
  pokemon_v2_evolutionchain: PokemonV2EvolutionChain;
  pokemon_v2_generation: { name: string };
}

export interface PokemonV2Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  pokemon_v2_pokemontypes: PokemonV2PokemonType[];
  pokemon_v2_pokemonspecy: PokemonV2PokemonSpecies;
  pokemon_v2_pokemonstats: PokemonV2PokemonStat[];
  pokemon_v2_pokemonabilities: PokemonV2PokemonAbility[];
  pokemon_v2_pokemonmoves: PokemonV2PokemonMove[];
}

export interface PokemonData {
  pokemon: PokemonV2Pokemon[];
}

export interface PokemonListData {
  pokemon: Array<{
    id: number;
    name: string;
    height: number;
    weight: number;
    pokemon_v2_pokemontypes: PokemonV2PokemonType[];
    pokemon_v2_pokemonspecy: {
      pokemon_v2_generation: {
        name: string;
      };
    };
    pokemon_v2_pokemonabilities: Array<{
      pokemon_v2_ability: {
        name: string;
      };
    }>;
  }>;
}
