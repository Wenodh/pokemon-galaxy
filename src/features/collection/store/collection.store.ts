import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CollectionStore, CollectionEntry, PokemonId } from "../types/collection.types";
import { collectionPersistOptions } from "./collection.persist";
import { isValidPokemonId } from "../utils/collection.validation";
import { COLLECTION_STORE_VERSION } from "../constants/collection.constants";

const createDefaultEntry = (id: PokemonId): CollectionEntry => ({
  pokemonId: id,
  seen: false,
  caught: false,
  shiny: false,
  alpha: false,
  lucky: false,
  updatedAt: Date.now(),
});

export const useCollectionStore = create<CollectionStore>()(
  persist(
    (set, get) => ({
      // State
      entries: {},
      version: COLLECTION_STORE_VERSION,

      // Actions
      markSeen: (id) => {
        if (!isValidPokemonId(id)) return;

        set((state) => {
          const entry = state.entries[id] || createDefaultEntry(id);
          if (entry.seen) return state;

          return {
            entries: {
              ...state.entries,
              [id]: { ...entry, seen: true, updatedAt: Date.now() },
            },
          };
        });
      },

      markCaught: (id, caught = true) => {
        if (!isValidPokemonId(id)) return;

        set((state) => {
          const entry = state.entries[id] || createDefaultEntry(id);
          // If marking caught, automatically mark as seen
          const seen = caught ? true : entry.seen;

          return {
            entries: {
              ...state.entries,
              [id]: { ...entry, seen, caught, updatedAt: Date.now() },
            },
          };
        });
      },

      markShiny: (id, shiny = true) => {
        if (!isValidPokemonId(id)) return;

        set((state) => {
          const entry = state.entries[id] || createDefaultEntry(id);
          return {
            entries: {
              ...state.entries,
              [id]: { ...entry, shiny, updatedAt: Date.now() },
            },
          };
        });
      },

      markAlpha: (id, alpha = true) => {
        if (!isValidPokemonId(id)) return;

        set((state) => {
          const entry = state.entries[id] || createDefaultEntry(id);
          return {
            entries: {
              ...state.entries,
              [id]: { ...entry, alpha, updatedAt: Date.now() },
            },
          };
        });
      },

      markLucky: (id, lucky = true) => {
        if (!isValidPokemonId(id)) return;

        set((state) => {
          const entry = state.entries[id] || createDefaultEntry(id);
          return {
            entries: {
              ...state.entries,
              [id]: { ...entry, lucky, updatedAt: Date.now() },
            },
          };
        });
      },

      removeFromCollection: (id) => {
        if (!isValidPokemonId(id)) return;

        set((state) => {
          if (!state.entries[id]) return state;
          const { [id]: _, ...remaining } = state.entries;
          return { entries: remaining };
        });
      },

      clearCollection: () => set({ entries: {} }),

      getEntry: (id) => {
        if (!isValidPokemonId(id)) return undefined;
        return get().entries[id];
      },
    }),
    collectionPersistOptions
  )
);
