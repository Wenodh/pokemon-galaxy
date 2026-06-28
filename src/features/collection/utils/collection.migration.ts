import { COLLECTION_STORE_VERSION } from "../constants/collection.constants";
import { CollectionStore } from "../types/collection.types";

/**
 * Handles store migrations for future versions.
 */
export function migrateCollectionStore(
  persistedState: any,
  version: number
): CollectionStore {
  // Current version matches, no migration needed
  if (version === COLLECTION_STORE_VERSION) {
    return persistedState as CollectionStore;
  }

  // Placeholder for future migrations
  /*
  if (version === 1) {
    // Migration from v1 to v2
  }
  */

  return persistedState as CollectionStore;
}
