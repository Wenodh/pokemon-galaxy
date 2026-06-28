import { describe, it, expect } from "vitest";
import {
  selectSeenCount,
  selectCaughtCount,
  selectShinyCount,
  selectCompletionPercentage
} from "../store/collection.selectors";
import { CollectionStore, CollectionEntry } from "../types/collection.types";
import { TOTAL_POKEMON_COUNT } from "../constants/collection.constants";

describe("CollectionSelectors", () => {
  const createEntry = (id: number, flags: Partial<CollectionEntry>): CollectionEntry => ({
    pokemonId: id,
    seen: false,
    caught: false,
    shiny: false,
    alpha: false,
    lucky: false,
    updatedAt: Date.now(),
    ...flags
  });

  const mockState = {
    entries: {
      1: createEntry(1, { seen: true, caught: true }),
      2: createEntry(2, { seen: true, caught: false }),
      3: createEntry(3, { seen: true, caught: true, shiny: true }),
    },
    version: 1
  } as unknown as CollectionStore;

  it("calculates seen count correctly", () => {
    expect(selectSeenCount(mockState)).toBe(3);
  });

  it("calculates caught count correctly", () => {
    expect(selectCaughtCount(mockState)).toBe(2);
  });

  it("calculates shiny count correctly", () => {
    expect(selectShinyCount(mockState)).toBe(1);
  });

  it("calculates completion percentage correctly", () => {
    // 2 caught out of TOTAL_POKEMON_COUNT (e.g. 1025)
    const expected = Math.round((2 / TOTAL_POKEMON_COUNT) * 100);
    expect(selectCompletionPercentage(mockState)).toBe(expected);
  });
});
