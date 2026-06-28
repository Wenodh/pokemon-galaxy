import { useFavoritesStore } from "../store/favorites.store";
import { selectFavoriteIds, selectFavoriteCount } from "../store/favorites.selectors";

/**
 * Hook to access favorite IDs and count.
 */
export const useFavorites = () => {
  const favoriteIds = useFavoritesStore(selectFavoriteIds);
  const favoriteCount = useFavoritesStore(selectFavoriteCount);

  return {
    favoriteIds,
    favoriteCount,
  };
};
