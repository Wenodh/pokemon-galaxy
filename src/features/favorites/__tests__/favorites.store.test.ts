import { describe, it, expect, beforeEach } from "vitest";
import { useFavoritesStore } from "../store/favorites.store";

describe("Favorites Store", () => {
  beforeEach(() => {
    // Reset store state before each test
    useFavoritesStore.getState().clearFavorites();
    // Clear localStorage to simulate fresh start
    localStorage.clear();
  });

  it("should start with an empty list of favorites", () => {
    const state = useFavoritesStore.getState();
    expect(state.favorites).toEqual([]);
    expect(state.getFavoriteCount()).toBe(0);
  });

  it("should add a favorite", () => {
    const { addFavorite, getFavorites, getFavoriteCount } = useFavoritesStore.getState();

    addFavorite(1);

    expect(getFavorites()).toEqual([1]);
    expect(getFavoriteCount()).toBe(1);
  });

  it("should not add duplicate favorites", () => {
    const { addFavorite, getFavorites, getFavoriteCount } = useFavoritesStore.getState();

    addFavorite(1);
    addFavorite(1);

    expect(getFavorites()).toEqual([1]);
    expect(getFavoriteCount()).toBe(1);
  });

  it("should remove a favorite", () => {
    const { addFavorite, removeFavorite, getFavorites } = useFavoritesStore.getState();

    addFavorite(1);
    addFavorite(2);
    removeFavorite(1);

    expect(getFavorites()).toEqual([2]);
  });

  it("should toggle a favorite", () => {
    const { toggleFavorite, isFavorite } = useFavoritesStore.getState();

    toggleFavorite(1);
    expect(isFavorite(1)).toBe(true);

    toggleFavorite(1);
    expect(isFavorite(1)).toBe(false);
  });

  it("should ignore invalid IDs when adding", () => {
    const { addFavorite, getFavorites } = useFavoritesStore.getState();

    // @ts-expect-error - testing runtime validation
    addFavorite(null);
    // @ts-expect-error - testing runtime validation
    addFavorite(undefined);
    addFavorite(-1);
    addFavorite(0);
    addFavorite(1.5);

    expect(getFavorites()).toEqual([]);
  });

  it("should clear all favorites", () => {
    const { addFavorite, clearFavorites, getFavoriteCount } = useFavoritesStore.getState();

    addFavorite(1);
    addFavorite(2);
    clearFavorites();

    expect(getFavoriteCount()).toBe(0);
  });
});
