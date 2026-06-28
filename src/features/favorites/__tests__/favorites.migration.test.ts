import { describe, it, expect } from "vitest";
import { migrateFavoritesState } from "../utils/favorites.migration";

describe("Favorites Migration", () => {
  it("should return a clean state if persisted state is corrupted or empty", () => {
    const corruptedState = { something: "else" };
    const migrated = migrateFavoritesState(corruptedState, 1);

    expect(migrated.favorites).toEqual([]);
    expect(migrated.version).toBe(1);
  });

  it("should validate favorites during migration", () => {
    const stateWithInvalidIds = {
      favorites: [1, -5, "10", null, 2],
      version: 1
    };

    const migrated = migrateFavoritesState(stateWithInvalidIds, 1);

    expect(migrated.favorites).toEqual([1, 2]);
  });

  it("should handle missing version", () => {
    const stateWithoutVersion = {
      favorites: [1, 2]
    };

    const migrated = migrateFavoritesState(stateWithoutVersion, 0);

    expect(migrated.favorites).toEqual([1, 2]);
    expect(migrated.version).toBe(1);
  });
});
