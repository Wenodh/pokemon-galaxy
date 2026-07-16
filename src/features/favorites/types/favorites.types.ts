export interface FavoritesState {
  favorites: number[];
  version: number;
  updatedAt: number;
}

export interface FavoritesActions {
  addFavorite: (id: number, name?: string) => void;
  removeFavorite: (id: number, name?: string) => void;
  toggleFavorite: (id: number, name?: string) => void;
  clearFavorites: () => void;
  isFavorite: (id: number) => boolean;
  getFavoriteCount: () => number;
  getFavorites: () => number[];
}

export type FavoritesStore = FavoritesState & FavoritesActions;
