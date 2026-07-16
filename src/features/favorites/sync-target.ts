import { useFavoritesStore } from "./store/favorites.store";
import { SyncTarget } from "@/features/cloud-sync/types/sync.types";
import { FAVORITES_STORE_VERSION } from "./constants/favorites.constants";

export const favoritesSyncTarget: SyncTarget<number[]> = {
  featureId: "favorites",

  getVersion: () => FAVORITES_STORE_VERSION,

  exportData: () => {
    return useFavoritesStore.getState().favorites;
  },

  importData: (data) => {
    useFavoritesStore.setState({
      favorites: data,
      updatedAt: Date.now(),
    });
  },

  mergeData: (remoteData, remoteUpdatedAt) => {
    const localState = useFavoritesStore.getState();

    // Last Write Wins
    if (remoteUpdatedAt > localState.updatedAt) {
      useFavoritesStore.setState({
        favorites: remoteData,
        updatedAt: remoteUpdatedAt,
      });
    }
  },

  validateData: (data): data is number[] => {
    return Array.isArray(data) && data.every((id) => typeof id === "number");
  },
};
