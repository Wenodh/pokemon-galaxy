export interface FavoritesState {
  favorites: number[];
  version: number;
}

export interface FavoritesActions {
  addFavorite: (id: number) => void;
  removeFavorite: (id: number) => void;
  toggleFavorite: (id: number) => void;
  clearFavorites: () => void;
  isFavorite: (id: number) => boolean;
  getFavoriteCount: () => number;
  getFavorites: () => number[];
}

export type FavoritesStore = FavoritesState & FavoritesActions;
