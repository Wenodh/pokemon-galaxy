import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FavoritesStore } from "../types/favorites.types";
import { favoritesPersistOptions } from "./favorites.persist";
import { isValidPokemonId } from "../utils/favorites.validation";
import { FAVORITES_STORE_VERSION } from "../constants/favorites.constants";

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      // State
      favorites: [],
      version: FAVORITES_STORE_VERSION,

      // Actions
      addFavorite: (id) => {
        if (!isValidPokemonId(id)) return;

        set((state) => {
          if (state.favorites.includes(id)) return state;
          return { favorites: [...state.favorites, id] };
        });
      },

      removeFavorite: (id) => {
        if (!isValidPokemonId(id)) return;

        set((state) => ({
          favorites: state.favorites.filter((favId) => favId !== id),
        }));
      },

      toggleFavorite: (id) => {
        if (!isValidPokemonId(id)) return;

        const { favorites } = get();
        if (favorites.includes(id)) {
          get().removeFavorite(id);
        } else {
          get().addFavorite(id);
        }
      },

      isFavorite: (id) => {
        if (!isValidPokemonId(id)) return false;
        return get().favorites.includes(id);
      },

      clearFavorites: () => set({ favorites: [] }),

      getFavoriteCount: () => get().favorites.length,

      getFavorites: () => get().favorites,
    }),
    favoritesPersistOptions
  )
);
