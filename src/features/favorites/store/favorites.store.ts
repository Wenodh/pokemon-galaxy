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
      addFavorite: (id, name) => {
        if (!isValidPokemonId(id)) return;

        let isNewFav = false;
        set((state) => {
          if (state.favorites.includes(id)) return state;
          isNewFav = true;
          return { favorites: [...state.favorites, id] };
        });

        if (isNewFav) {
          import("../../trainer/application/event-service").then(({ TrainerEventService }) => {
            TrainerEventService.emit({
              type: "FAVORITE_ADDED",
              id,
              name: name || `Pokémon #${id}`,
            });
          }).catch((err) => {
            console.error("TrainerEventService addFavorite emit failed silently", err);
          });
        }
      },

      removeFavorite: (id, name) => {
        if (!isValidPokemonId(id)) return;

        let isRemoved = false;
        set((state) => {
          if (!state.favorites.includes(id)) return state;
          isRemoved = true;
          return {
            favorites: state.favorites.filter((favId) => favId !== id),
          };
        });

        if (isRemoved) {
          import("../../trainer/application/event-service").then(({ TrainerEventService }) => {
            TrainerEventService.emit({
              type: "FAVORITE_REMOVED",
              id,
              name: name || `Pokémon #${id}`,
            });
          }).catch((err) => {
            console.error("TrainerEventService removeFavorite emit failed silently", err);
          });
        }
      },

      toggleFavorite: (id, name) => {
        if (!isValidPokemonId(id)) return;

        const { favorites } = get();
        if (favorites.includes(id)) {
          get().removeFavorite(id, name);
        } else {
          get().addFavorite(id, name);
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
