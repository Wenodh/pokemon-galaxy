import { describe, it, expect, beforeEach, vi } from "vitest";
import { useCollectionStore } from "../store/collection.store";

describe("CollectionStore", () => {
  beforeEach(() => {
    useCollectionStore.getState().clearCollection();
  });

  it("starts with empty entries", () => {
    const state = useCollectionStore.getState();
    expect(state.entries).toEqual({});
  });

  it("marks a pokemon as seen", () => {
    const { markSeen } = useCollectionStore.getState();
    markSeen(1);

    const entry = useCollectionStore.getState().entries[1];
    expect(entry).toBeDefined();
    expect(entry.seen).toBe(true);
    expect(entry.caught).toBe(false);
  });

  it("marks a pokemon as caught (and automatically seen)", () => {
    const { markCaught } = useCollectionStore.getState();
    markCaught(4);

    const entry = useCollectionStore.getState().entries[4];
    expect(entry).toBeDefined();
    expect(entry.seen).toBe(true);
    expect(entry.caught).toBe(true);
  });

  it("toggles flags correctly", () => {
    const { markShiny, markAlpha, markLucky } = useCollectionStore.getState();

    markShiny(25, true);
    markAlpha(25, true);
    markLucky(25, false);

    const entry = useCollectionStore.getState().entries[25];
    expect(entry.shiny).toBe(true);
    expect(entry.alpha).toBe(true);
    expect(entry.lucky).toBe(false);
  });

  it("removes a pokemon from collection", () => {
    const { markSeen, removeFromCollection } = useCollectionStore.getState();

    markSeen(1);
    expect(useCollectionStore.getState().entries[1]).toBeDefined();

    removeFromCollection(1);
    expect(useCollectionStore.getState().entries[1]).toBeUndefined();
  });

  it("clears the entire collection", () => {
    const { markSeen, clearCollection } = useCollectionStore.getState();

    markSeen(1);
    markSeen(2);

    clearCollection();
    expect(useCollectionStore.getState().entries).toEqual({});
  });

  it("does not allow invalid pokemon IDs", () => {
    const { markSeen } = useCollectionStore.getState();

    // @ts-ignore
    markSeen(-1);
    // @ts-ignore
    markSeen(0);
    // @ts-ignore
    markSeen("1");

    expect(useCollectionStore.getState().entries).toEqual({});
  });

  it("updates updatedAt timestamp when an entry changes", () => {
    const { markSeen, markShiny } = useCollectionStore.getState();

    markSeen(1);
    const firstUpdate = useCollectionStore.getState().entries[1].updatedAt;

    // Fast forward time slightly if needed, but Date.now() should suffice between calls usually
    // Using vi.setSystemTime for precision
    vi.useFakeTimers();
    vi.advanceTimersByTime(1000);

    markShiny(1, true);
    const secondUpdate = useCollectionStore.getState().entries[1].updatedAt;

    expect(secondUpdate).toBeGreaterThan(firstUpdate);
    vi.useRealTimers();
  });
});
