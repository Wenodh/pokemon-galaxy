import { PersistOptions } from "zustand/middleware";
import { FavoritesState, FavoritesStore } from "../types/favorites.types";
import { FAVORITES_STORAGE_KEY, FAVORITES_STORE_VERSION } from "../constants/favorites.constants";
import { migrateFavoritesState } from "../utils/favorites.migration";

export const favoritesPersistOptions: PersistOptions<FavoritesStore, FavoritesState> = {
  name: FAVORITES_STORAGE_KEY,
  version: FAVORITES_STORE_VERSION,
  migrate: (persistedState: unknown, version: number) =>
    migrateFavoritesState(persistedState, version),
  // We only want to persist the state, not the actions
  partialize: (state) => ({
    favorites: state.favorites,
    version: state.version,
    updatedAt: state.updatedAt,
  }),
};
