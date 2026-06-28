import { describe, it, expect } from "vitest";
import { selectFavoriteIds, selectFavoriteCount, selectIsFavorite } from "../store/favorites.selectors";
import { FavoritesStore } from "../types/favorites.types";

describe("Favorites Selectors", () => {
  const mockState = {
    favorites: [1, 2, 3],
    version: 1,
  } as FavoritesStore;

  it("should select favorite IDs", () => {
    expect(selectFavoriteIds(mockState)).toEqual([1, 2, 3]);
  });

  it("should select favorite count", () => {
    expect(selectFavoriteCount(mockState)).toBe(3);
  });

  it("should select favorite status", () => {
    expect(selectIsFavorite(1)(mockState)).toBe(true);
    expect(selectIsFavorite(4)(mockState)).toBe(false);
  });
});
