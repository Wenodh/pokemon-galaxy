import { describe, it, expect, beforeEach } from "vitest";
import { useRecentlyViewedStore } from "../store/recently-viewed.store";
import { MAX_RECENT_ITEMS } from "../constants/recently-viewed.constants";

describe("RecentlyViewed Store", () => {
  beforeEach(() => {
    useRecentlyViewedStore.getState().clearHistory();
  });

  it("should add a Pokémon ID to history", () => {
    const { addRecent } = useRecentlyViewedStore.getState();
    addRecent(1);
    expect(useRecentlyViewedStore.getState().recentIds).toEqual([1]);
  });

  it("should move existing Pokémon ID to the top", () => {
    const { addRecent } = useRecentlyViewedStore.getState();
    addRecent(1);
    addRecent(2);
    addRecent(1);
    expect(useRecentlyViewedStore.getState().recentIds).toEqual([1, 2]);
  });

  it("should respect MAX_RECENT_ITEMS limit", () => {
    const { addRecent } = useRecentlyViewedStore.getState();
    for (let i = 1; i <= MAX_RECENT_ITEMS + 5; i++) {
      addRecent(i);
    }
    const state = useRecentlyViewedStore.getState();
    expect(state.recentIds).toHaveLength(MAX_RECENT_ITEMS);
    expect(state.recentIds[0]).toBe(MAX_RECENT_ITEMS + 5);
  });

  it("should clear history", () => {
    const { addRecent, clearHistory } = useRecentlyViewedStore.getState();
    addRecent(1);
    addRecent(2);
    clearHistory();
    expect(useRecentlyViewedStore.getState().recentIds).toEqual([]);
  });

  it("should handle invalid IDs", () => {
    const { addRecent } = useRecentlyViewedStore.getState();
    addRecent(0);
    addRecent(-1);
    expect(useRecentlyViewedStore.getState().recentIds).toEqual([]);
  });
});
