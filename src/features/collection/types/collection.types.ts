export type PokemonId = number;

export interface CollectionEntry {
  pokemonId: PokemonId;
  seen: boolean;
  caught: boolean;
  shiny: boolean;
  alpha: boolean;
  lucky: boolean;
  updatedAt: number;
}

export type CollectionMap = Record<PokemonId, CollectionEntry>;

export interface CollectionState {
  entries: CollectionMap;
  version: number;
}

export interface CollectionActions {
  markSeen: (id: PokemonId) => void;
  markCaught: (id: PokemonId, caught?: boolean) => void;
  markShiny: (id: PokemonId, shiny?: boolean) => void;
  markAlpha: (id: PokemonId, alpha?: boolean) => void;
  markLucky: (id: PokemonId, lucky?: boolean) => void;
  removeFromCollection: (id: PokemonId) => void;
  clearCollection: () => void;
  getEntry: (id: PokemonId) => CollectionEntry | undefined;
}

export type CollectionStore = CollectionState & CollectionActions;
