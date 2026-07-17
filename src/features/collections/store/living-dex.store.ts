import { create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import { LivingDexStore, LivingDexEntry } from "../types";
import { LIVING_DEX_STORAGE_KEY, LIVING_DEX_STORE_VERSION } from "../constants";
import { useSyncQueueStore } from "../../cloud-sync/store/sync-queue.store";

const livingDexPersistOptions: PersistOptions<LivingDexStore, any> = {
  name: LIVING_DEX_STORAGE_KEY,
  version: LIVING_DEX_STORE_VERSION,
  partialize: (state) => ({
    entries: state.entries,
    currentStreak: state.currentStreak,
    longestStreak: state.longestStreak,
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
      currentStreak: undefined, // future-ready placeholder
      longestStreak: undefined, // future-ready placeholder
      version: LIVING_DEX_STORE_VERSION,
      updatedAt: Date.now(),

      // Actions
      markSeen: (pokemonId, seen = true, name) => {
        let isNewSeen = false;
        set((state) => {
          const entry = state.entries[pokemonId] || createDefaultEntry(pokemonId);
          if (entry.seen === seen) return state;

          isNewSeen = seen;

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
            updatedAt: Date.now(),
          };
        });

        if (isNewSeen) {
          useSyncQueueStore.getState().addOperation("living-dex", "PUSH");
          import("../../trainer/application/event-service").then(({ TrainerEventService }) => {
            TrainerEventService.emit({
              type: "POKEMON_SEEN",
              id: pokemonId,
              name: name || `Pokémon #${pokemonId}`,
            });
          });
        }
      },

      markCaught: (pokemonId, caught = true, name) => {
        let isNewCaught = false;
        set((state) => {
          const entry = state.entries[pokemonId] || createDefaultEntry(pokemonId);
          if (entry.caught === caught) return state;

          isNewCaught = caught;

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
            updatedAt: Date.now(),
          };
        });

        if (isNewCaught) {
          useSyncQueueStore.getState().addOperation("living-dex", "PUSH");
          import("../../trainer/application/event-service").then(({ TrainerEventService }) => {
            TrainerEventService.emit({
              type: "POKEMON_CAUGHT",
              id: pokemonId,
              name: name || `Pokémon #${pokemonId}`,
            });
          });
        }
      },

      bulkMarkSeen: (pokemonIds, seen = true) => {
        const newlySeenIds: number[] = [];
        set((state) => {
          const updatedEntries = { ...state.entries };
          const now = Date.now();

          pokemonIds.forEach((id) => {
            const entry = updatedEntries[id] || createDefaultEntry(id);
            if (entry.seen !== seen) {
              if (seen) newlySeenIds.push(id);
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
            }
          });

          return {
            entries: updatedEntries,
            updatedAt: Date.now(),
          };
        });

        if (newlySeenIds.length > 0) {
          import("../../trainer/application/event-service").then(({ TrainerEventService }) => {
            newlySeenIds.forEach((id) => {
              TrainerEventService.emit({
                type: "POKEMON_SEEN",
                id,
                name: `Pokémon #${id}`,
              });
            });
          });
        }
      },

      bulkMarkCaught: (pokemonIds, caught = true) => {
        const newlyCaughtIds: number[] = [];
        set((state) => {
          const updatedEntries = { ...state.entries };
          const now = Date.now();

          pokemonIds.forEach((id) => {
            const entry = updatedEntries[id] || createDefaultEntry(id);
            if (entry.caught !== caught) {
              if (caught) newlyCaughtIds.push(id);
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
            }
          });

          return { entries: updatedEntries };
        });

        if (newlyCaughtIds.length > 0) {
          import("../../trainer/application/event-service").then(({ TrainerEventService }) => {
            newlyCaughtIds.forEach((id) => {
              TrainerEventService.emit({
                type: "POKEMON_CAUGHT",
                id,
                name: `Pokémon #${id}`,
              });
            });
          });
        }
      },

      clearLivingDex: () =>
        set({
          entries: {},
          currentStreak: undefined,
          longestStreak: undefined,
          updatedAt: Date.now(),
        }),
    }),
    livingDexPersistOptions
  )
);
