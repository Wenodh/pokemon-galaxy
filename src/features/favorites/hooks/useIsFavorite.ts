import { useCallback } from "react";
import { useFavoritesStore } from "../store/favorites.store";
import { selectIsFavorite } from "../store/favorites.selectors";

/**
 * Hook to check if a specific Pokémon is favorited.
 */
export const useIsFavorite = (id: number) => {
  // Use the memoized selector with the ID
  return useFavoritesStore(useCallback(selectIsFavorite(id), [id]));
};
