import { PersistOptions } from "zustand/middleware";
import { CollectionStore } from "../types/collection.types";
import {
  COLLECTION_STORAGE_KEY,
  COLLECTION_STORE_VERSION,
} from "../constants/collection.constants";
import { migrateCollectionStore } from "../utils/collection.migration";
import { validatePersistedCollection } from "../utils/collection.validation";

export const collectionPersistOptions: PersistOptions<CollectionStore> = {
  name: COLLECTION_STORAGE_KEY,
  version: COLLECTION_STORE_VERSION,
  migrate: (persistedState, version) =>
    migrateCollectionStore(persistedState, version),
  onRehydrateStorage: () => (state) => {
    if (state && !validatePersistedCollection(state)) {
      console.warn("Detected corrupted collection storage. Resetting...");
      state.clearCollection();
    }
  },
};
