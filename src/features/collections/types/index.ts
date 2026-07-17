export type PokemonId = number;

export type Result<T = undefined> =
  | { ok: true; value: T }
  | { ok: false; error: string };

export interface Collection {
  id: string;
  name: string;
  description: string;
  pokemonIds: PokemonId[]; // Ordered list of Pokémon IDs in this collection
  coverPokemonId?: PokemonId;
  color?: string;
  icon?: string;
  createdAt: number;
  updatedAt: number;
  [key: string]: any; // Support future metadata without breaking persistence
}

export interface CollectionsState {
  collections: Record<string, Collection>;
  collectionOrder: string[]; // Ordered list of collection IDs
  version: number;
  updatedAt: number;
}

export interface CollectionsActions {
  createCollection: (
    name: string,
    description?: string,
    color?: string,
    icon?: string
  ) => Result<string>;
  renameCollection: (id: string, name: string) => Result<void>;
  updateDescription: (id: string, description: string) => Result<void>;
  updateCoverPokemon: (id: string, coverPokemonId: PokemonId | undefined) => Result<void>;
  updateColorAndIcon: (id: string, color?: string, icon?: string) => Result<void>;
  deleteCollection: (id: string) => void;
  duplicateCollection: (id: string) => Result<string>;
  reorderCollections: (startIndex: number, endIndex: number) => void;

  addPokemonToCollection: (collectionId: string, pokemonId: PokemonId) => Result<void>;
  removePokemonFromCollection: (collectionId: string, pokemonId: PokemonId) => Result<void>;
  reorderPokemonInCollection: (
    collectionId: string,
    startIndex: number,
    endIndex: number
  ) => void;

  bulkAddPokemonToCollection: (collectionId: string, pokemonIds: PokemonId[]) => Result<void>;
  bulkRemovePokemonFromCollection: (collectionId: string, pokemonIds: PokemonId[]) => Result<void>;
  movePokemonBetweenCollections: (
    sourceCollectionId: string,
    targetCollectionId: string,
    pokemonIds: PokemonId[]
  ) => Result<void>;

  importCollection: (importedJson: string) => Result<string>;
  exportCollection: (collectionId: string) => Result<string>;
}

export type CollectionsStore = CollectionsState & CollectionsActions;


// --- Living Dex Types ---

export interface LivingDexEntry {
  pokemonId: PokemonId;
  seen: boolean;
  caught: boolean;
  firstSeenAt?: number;
  firstCaughtAt?: number;
}

export interface LivingDexState {
  entries: Record<PokemonId, LivingDexEntry>;
  currentStreak?: number;
  longestStreak?: number;
  version: number;
  updatedAt: number;
}

export interface LivingDexActions {
  markSeen: (pokemonId: PokemonId, seen?: boolean, name?: string) => void;
  markCaught: (pokemonId: PokemonId, caught?: boolean, name?: string) => void;
  bulkMarkSeen: (pokemonIds: PokemonId[], seen?: boolean) => void;
  bulkMarkCaught: (pokemonIds: PokemonId[], caught?: boolean) => void;
  clearLivingDex: () => void;
}

export type LivingDexStore = LivingDexState & LivingDexActions;
