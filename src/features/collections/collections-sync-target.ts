import { useCollectionsStore } from "./store/collections.store";
import { SyncTarget } from "@/features/cloud-sync/types/sync.types";
import { COLLECTIONS_STORE_VERSION } from "./constants";
import { Collection } from "./types";

interface CollectionsSyncData {
  collections: Record<string, Collection>;
  collectionOrder: string[];
}

export const collectionsSyncTarget: SyncTarget<CollectionsSyncData> = {
  featureId: "collections",

  getVersion: () => COLLECTIONS_STORE_VERSION,

  exportData: () => {
    const state = useCollectionsStore.getState();
    return {
      collections: state.collections,
      collectionOrder: state.collectionOrder,
    };
  },

  importData: (data) => {
    useCollectionsStore.setState({
      ...data,
      updatedAt: Date.now(),
    });
  },

  mergeData: (remoteData, remoteUpdatedAt) => {
    const localState = useCollectionsStore.getState();

    if (remoteUpdatedAt > localState.updatedAt) {
      useCollectionsStore.setState({
        ...remoteData,
        updatedAt: remoteUpdatedAt,
      });
    }
  },

  validateData: (data): data is CollectionsSyncData => {
    return (
      data &&
      typeof data === "object" &&
      "collections" in data &&
      "collectionOrder" in data
    );
  },
};
