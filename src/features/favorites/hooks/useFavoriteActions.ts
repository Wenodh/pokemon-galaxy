import { useShallow } from "zustand/react/shallow";
import { useFavoritesStore } from "../store/favorites.store";
import { selectFavoriteActions } from "../store/favorites.selectors";

/**
 * Hook to access favorite actions.
 * Uses useShallow to ensure the returned actions object has a stable reference.
 */
export const useFavoriteActions = () => {
  return useFavoritesStore(useShallow(selectFavoriteActions));
};
