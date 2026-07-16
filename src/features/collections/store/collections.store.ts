import { create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import { CollectionsStore, Collection } from "../types";
import { COLLECTIONS_STORAGE_KEY, COLLECTIONS_STORE_VERSION } from "../constants";
import { validateCollectionName, generateUniqueCollectionCopyName } from "../utils/validation";

const collectionsPersistOptions: PersistOptions<CollectionsStore, any> = {
  name: COLLECTIONS_STORAGE_KEY,
  version: COLLECTIONS_STORE_VERSION,
  partialize: (state) => ({
    collections: state.collections,
    collectionOrder: state.collectionOrder,
    version: state.version,
  }),
};

export const useCollectionsStore = create<CollectionsStore>()(
  persist(
    (set, get) => ({
      // State
      collections: {},
      collectionOrder: [],
      version: COLLECTIONS_STORE_VERSION,

      // Actions
      createCollection: (name, description = "", color, icon) => {
        const existing = Object.values(get().collections);
        const validation = validateCollectionName(name, existing);
        if (!validation.ok) return validation;

        const newCollection: Collection = {
          id: crypto.randomUUID(),
          name: validation.value,
          description,
          pokemonIds: [],
          color,
          icon,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        set((state) => ({
          collections: { ...state.collections, [newCollection.id]: newCollection },
          collectionOrder: [...state.collectionOrder, newCollection.id],
        }));

        import("../../trainer/application/event-service").then(({ TrainerEventService }) => {
          TrainerEventService.emit({
            type: "COLLECTION_CREATED",
            name: validation.value,
            collectionId: newCollection.id,
          });
        });

        return { ok: true, value: newCollection.id };
      },

      renameCollection: (id, name) => {
        const collection = get().collections[id];
        if (!collection) return { ok: false, error: "COLLECTION_NOT_FOUND" };

        const existing = Object.values(get().collections);
        const validation = validateCollectionName(name, existing, id);
        if (!validation.ok) return validation;

        set((state) => ({
          collections: {
            ...state.collections,
            [id]: {
              ...collection,
              name: validation.value,
              updatedAt: Date.now(),
            },
          },
        }));

        return { ok: true, value: undefined };
      },

      updateDescription: (id, description) => {
        const collection = get().collections[id];
        if (!collection) return { ok: false, error: "COLLECTION_NOT_FOUND" };

        set((state) => ({
          collections: {
            ...state.collections,
            [id]: {
              ...collection,
              description,
              updatedAt: Date.now(),
            },
          },
        }));

        return { ok: true, value: undefined };
      },

      updateCoverPokemon: (id, coverPokemonId) => {
        const collection = get().collections[id];
        if (!collection) return { ok: false, error: "COLLECTION_NOT_FOUND" };

        set((state) => ({
          collections: {
            ...state.collections,
            [id]: {
              ...collection,
              coverPokemonId,
              updatedAt: Date.now(),
            },
          },
        }));

        return { ok: true, value: undefined };
      },

      updateColorAndIcon: (id, color, icon) => {
        const collection = get().collections[id];
        if (!collection) return { ok: false, error: "COLLECTION_NOT_FOUND" };

        set((state) => ({
          collections: {
            ...state.collections,
            [id]: {
              ...collection,
              color,
              icon,
              updatedAt: Date.now(),
            },
          },
        }));

        return { ok: true, value: undefined };
      },

      deleteCollection: (id) => {
        set((state) => {
          const { [id]: _, ...remaining } = state.collections;
          const newOrder = state.collectionOrder.filter((colId) => colId !== id);
          return {
            collections: remaining,
            collectionOrder: newOrder,
          };
        });
      },

      duplicateCollection: (id) => {
        const collection = get().collections[id];
        if (!collection) return { ok: false, error: "COLLECTION_NOT_FOUND" };

        const existing = Object.values(get().collections);
        const newName = generateUniqueCollectionCopyName(collection.name, existing);

        const newCollection: Collection = {
          ...collection,
          id: crypto.randomUUID(),
          name: newName,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        set((state) => ({
          collections: { ...state.collections, [newCollection.id]: newCollection },
          collectionOrder: [...state.collectionOrder, newCollection.id],
        }));

        return { ok: true, value: newCollection.id };
      },

      reorderCollections: (startIndex, endIndex) => {
        const order = [...get().collectionOrder];
        if (
          startIndex < 0 ||
          startIndex >= order.length ||
          endIndex < 0 ||
          endIndex >= order.length
        ) {
          return;
        }

        const [removed] = order.splice(startIndex, 1);
        order.splice(endIndex, 0, removed);

        set({ collectionOrder: order });
      },

      addPokemonToCollection: (collectionId, pokemonId) => {
        const collection = get().collections[collectionId];
        if (!collection) return { ok: false, error: "COLLECTION_NOT_FOUND" };

        if (collection.pokemonIds.includes(pokemonId)) {
          return { ok: false, error: "DUPLICATE_POKEMON" };
        }

        set((state) => ({
          collections: {
            ...state.collections,
            [collectionId]: {
              ...collection,
              pokemonIds: [...collection.pokemonIds, pokemonId],
              updatedAt: Date.now(),
            },
          },
        }));

        return { ok: true, value: undefined };
      },

      removePokemonFromCollection: (collectionId, pokemonId) => {
        const collection = get().collections[collectionId];
        if (!collection) return { ok: false, error: "COLLECTION_NOT_FOUND" };

        if (!collection.pokemonIds.includes(pokemonId)) {
          return { ok: false, error: "POKEMON_NOT_IN_COLLECTION" };
        }

        set((state) => {
          const newPokemonIds = collection.pokemonIds.filter((id) => id !== pokemonId);
          // If the cover Pokémon was removed, clear it or pick undefined
          const coverPokemonId =
            collection.coverPokemonId === pokemonId ? undefined : collection.coverPokemonId;

          return {
            collections: {
              ...state.collections,
              [collectionId]: {
                ...collection,
                pokemonIds: newPokemonIds,
                coverPokemonId,
                updatedAt: Date.now(),
              },
            },
          };
        });

        return { ok: true, value: undefined };
      },

      reorderPokemonInCollection: (collectionId, startIndex, endIndex) => {
        const collection = get().collections[collectionId];
        if (!collection) return;

        const list = [...collection.pokemonIds];
        if (
          startIndex < 0 ||
          startIndex >= list.length ||
          endIndex < 0 ||
          endIndex >= list.length
        ) {
          return;
        }

        const [removed] = list.splice(startIndex, 1);
        list.splice(endIndex, 0, removed);

        set((state) => ({
          collections: {
            ...state.collections,
            [collectionId]: {
              ...collection,
              pokemonIds: list,
              updatedAt: Date.now(),
            },
          },
        }));
      },

      bulkAddPokemonToCollection: (collectionId, pokemonIds) => {
        const collection = get().collections[collectionId];
        if (!collection) return { ok: false, error: "COLLECTION_NOT_FOUND" };

        // Filter out duplicates that are already in the collection and within the input array
        const uniqueInputs = Array.from(new Set(pokemonIds));
        const newIds = uniqueInputs.filter((id) => !collection.pokemonIds.includes(id));

        if (newIds.length === 0) {
          return { ok: true, value: undefined }; // None added but not a throwing failure
        }

        set((state) => ({
          collections: {
            ...state.collections,
            [collectionId]: {
              ...collection,
              pokemonIds: [...collection.pokemonIds, ...newIds],
              updatedAt: Date.now(),
            },
          },
        }));

        return { ok: true, value: undefined };
      },

      bulkRemovePokemonFromCollection: (collectionId, pokemonIds) => {
        const collection = get().collections[collectionId];
        if (!collection) return { ok: false, error: "COLLECTION_NOT_FOUND" };

        const newPokemonIds = collection.pokemonIds.filter((id) => !pokemonIds.includes(id));
        const coverPokemonId =
          collection.coverPokemonId && pokemonIds.includes(collection.coverPokemonId)
            ? undefined
            : collection.coverPokemonId;

        set((state) => ({
          collections: {
            ...state.collections,
            [collectionId]: {
              ...collection,
              pokemonIds: newPokemonIds,
              coverPokemonId,
              updatedAt: Date.now(),
            },
          },
        }));

        return { ok: true, value: undefined };
      },

      movePokemonBetweenCollections: (sourceCollectionId, targetCollectionId, pokemonIds) => {
        const source = get().collections[sourceCollectionId];
        const target = get().collections[targetCollectionId];

        if (!source || !target) {
          return { ok: false, error: "COLLECTION_NOT_FOUND" };
        }

        // Add to target
        const targetNewIds = pokemonIds.filter((id) => !target.pokemonIds.includes(id));

        // Remove from source
        const sourceNewIds = source.pokemonIds.filter((id) => !pokemonIds.includes(id));
        const sourceCover =
          source.coverPokemonId && pokemonIds.includes(source.coverPokemonId)
            ? undefined
            : source.coverPokemonId;

        set((state) => ({
          collections: {
            ...state.collections,
            [sourceCollectionId]: {
              ...source,
              pokemonIds: sourceNewIds,
              coverPokemonId: sourceCover,
              updatedAt: Date.now(),
            },
            [targetCollectionId]: {
              ...target,
              pokemonIds: [...target.pokemonIds, ...targetNewIds],
              updatedAt: Date.now(),
            },
          },
        }));

        return { ok: true, value: undefined };
      },

      exportCollection: (collectionId) => {
        const collection = get().collections[collectionId];
        if (!collection) return { ok: false, error: "COLLECTION_NOT_FOUND" };

        const payload = {
          version: COLLECTIONS_STORE_VERSION,
          collection: {
            name: collection.name,
            description: collection.description,
            pokemonIds: collection.pokemonIds,
            coverPokemonId: collection.coverPokemonId,
            color: collection.color,
            icon: collection.icon,
          },
        };

        try {
          const json = JSON.stringify(payload, null, 2);

          import("../../trainer/application/event-service").then(({ TrainerEventService }) => {
            TrainerEventService.emit({
              type: "COLLECTION_EXPORTED",
              name: collection.name,
            });
          });

          return { ok: true, value: json };
        } catch (e) {
          return { ok: false, error: "EXPORT_FAILED" };
        }
      },

      importCollection: (importedJson) => {
        try {
          const payload = JSON.parse(importedJson);
          if (payload.version !== COLLECTIONS_STORE_VERSION) {
            return { ok: false, error: "UNSUPPORTED_VERSION" };
          }

          const importedCol = payload.collection;
          if (!importedCol || typeof importedCol.name !== "string") {
            return { ok: false, error: "INVALID_FORMAT" };
          }

          const existing = Object.values(get().collections);
          const validatedName = generateUniqueCollectionCopyName(importedCol.name, existing);

          const newCollection: Collection = {
            id: crypto.randomUUID(),
            name: validatedName,
            description: importedCol.description || "",
            pokemonIds: Array.isArray(importedCol.pokemonIds) ? importedCol.pokemonIds : [],
            coverPokemonId: typeof importedCol.coverPokemonId === "number" ? importedCol.coverPokemonId : undefined,
            color: importedCol.color,
            icon: importedCol.icon,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };

          set((state) => ({
            collections: { ...state.collections, [newCollection.id]: newCollection },
            collectionOrder: [...state.collectionOrder, newCollection.id],
          }));

          import("../../trainer/application/event-service").then(({ TrainerEventService }) => {
            TrainerEventService.emit({
              type: "COLLECTION_IMPORTED",
              name: validatedName,
            });
          });

          return { ok: true, value: newCollection.id };
        } catch (e) {
          return { ok: false, error: "INVALID_JSON" };
        }
      },
    }),
    collectionsPersistOptions
  )
);
