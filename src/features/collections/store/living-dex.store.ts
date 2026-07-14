import { create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import { LivingDexStore, LivingDexEntry } from "../types";
import { LIVING_DEX_STORAGE_KEY, LIVING_DEX_STORE_VERSION } from "../constants";

const livingDexPersistOptions: PersistOptions<LivingDexStore, any> = {
  name: LIVING_DEX_STORAGE_KEY,
  version: LIVING_DEX_STORE_VERSION,
  partialize: (state) => ({
    entries: state.entries,
    version: state.version,
  }),
};

const createDefaultEntry = (pokemonId: number): LivingDexEntry => ({
  pokemonId,
  seen: false,
  caught: false,
});

export const useLivingDexStore = create<LivingDexStore>()(
  persist(
    (set) => ({
      // State
      entries: {},
      version: LIVING_DEX_STORE_VERSION,

      // Actions
      markSeen: (pokemonId, seen = true) => {
        set((state) => {
          const entry = state.entries[pokemonId] || createDefaultEntry(pokemonId);
          if (entry.seen === seen) return state;

          const updatedEntry: LivingDexEntry = {
            ...entry,
            seen,
            firstSeenAt: seen ? entry.firstSeenAt || Date.now() : undefined,
          };

          // If unseeing, we must also uncaught it
          if (!seen) {
            updatedEntry.caught = false;
            updatedEntry.firstCaughtAt = undefined;
          }

          return {
            entries: {
              ...state.entries,
              [pokemonId]: updatedEntry,
            },
          };
        });
      },

      markCaught: (pokemonId, caught = true) => {
        set((state) => {
          const entry = state.entries[pokemonId] || createDefaultEntry(pokemonId);
          if (entry.caught === caught) return state;

          const updatedEntry: LivingDexEntry = {
            ...entry,
            caught,
            firstCaughtAt: caught ? entry.firstCaughtAt || Date.now() : undefined,
          };

          // If catching, automatically mark as seen
          if (caught) {
            updatedEntry.seen = true;
            updatedEntry.firstSeenAt = entry.firstSeenAt || Date.now();
          }

          return {
            entries: {
              ...state.entries,
              [pokemonId]: updatedEntry,
            },
          };
        });
      },

      bulkMarkSeen: (pokemonIds, seen = true) => {
        set((state) => {
          const updatedEntries = { ...state.entries };
          const now = Date.now();

          pokemonIds.forEach((id) => {
            const entry = updatedEntries[id] || createDefaultEntry(id);
            const updatedEntry = {
              ...entry,
              seen,
              firstSeenAt: seen ? entry.firstSeenAt || now : undefined,
            };

            if (!seen) {
              updatedEntry.caught = false;
              updatedEntry.firstCaughtAt = undefined;
            }

            updatedEntries[id] = updatedEntry;
          });

          return { entries: updatedEntries };
        });
      },

      bulkMarkCaught: (pokemonIds, caught = true) => {
        set((state) => {
          const updatedEntries = { ...state.entries };
          const now = Date.now();

          pokemonIds.forEach((id) => {
            const entry = updatedEntries[id] || createDefaultEntry(id);
            const updatedEntry = {
              ...entry,
              caught,
              firstCaughtAt: caught ? entry.firstCaughtAt || now : undefined,
            };

            if (caught) {
              updatedEntry.seen = true;
              updatedEntry.firstSeenAt = entry.firstSeenAt || now;
            }

            updatedEntries[id] = updatedEntry;
          });

          return { entries: updatedEntries };
        });
      },

      clearLivingDex: () => set({ entries: {} }),
    }),
    livingDexPersistOptions
  )
);
