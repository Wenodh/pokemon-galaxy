import { FavoritesStore } from "../types/favorites.types";

export const selectFavoriteIds = (state: FavoritesStore) => state.favorites;
export const selectFavoriteCount = (state: FavoritesStore) => state.favorites.length;

// For individual status, we use a factory-style selector or a hook that takes an ID
export const selectIsFavorite = (id: number) => (state: FavoritesStore) =>
  state.favorites.includes(id);

export const selectFavoriteActions = (state: FavoritesStore) => ({
  add: state.addFavorite,
  remove: state.removeFavorite,
  toggle: state.toggleFavorite,
  clear: state.clearFavorites,
});
