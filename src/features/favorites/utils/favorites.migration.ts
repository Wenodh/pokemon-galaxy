import { FavoritesState } from "../types/favorites.types";
import { validateFavorites } from "./favorites.validation";

/**
 * Handles state migrations for the Favorites store.
 */
export const migrateFavoritesState = (persistedState: unknown, version: number): FavoritesState => {
  if (version === 0) {
    // Future proofing: Example migration from v0 to v1
    // const oldState = persistedState as any;
    // return { ...initialState, favorites: oldState.oldField };
  }

  // Default: Return the state as is (if valid) or a clean state
  const state = persistedState as Partial<FavoritesState>;

  return {
    favorites: validateFavorites(state.favorites || []),
    version: state.version || 1,
  };
};
