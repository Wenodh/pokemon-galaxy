import { describe, it, expect, vi } from "vitest";
import { sortItems } from "../sort/sort-engine";
import { SortConfig, SortableItem } from "../sort/sort.types";

describe("Sort Engine", () => {
  const mockItems: SortableItem[] = [
    { id: 4, name: "Charmander", hp: 39, attack: 52 },
    { id: 1, name: "Bulbasaur", hp: 45, attack: 49 },
    { id: 7, name: "Squirtle", hp: 44, attack: 48 },
    { id: 25, name: "Pikachu", hp: 35, attack: 55 },
  ];

  it("should sort by ID ascending", () => {
    const config: SortConfig = { field: "id", direction: "asc" };
    const sorted = sortItems(mockItems, config);
    expect(sorted[0].id).toBe(1);
    expect(sorted[1].id).toBe(4);
    expect(sorted[2].id).toBe(7);
    expect(sorted[3].id).toBe(25);
  });

  it("should sort by ID descending", () => {
    const config: SortConfig = { field: "id", direction: "desc" };
    const sorted = sortItems(mockItems, config);
    expect(sorted[0].id).toBe(25);
    expect(sorted[1].id).toBe(7);
    expect(sorted[2].id).toBe(4);
    expect(sorted[3].id).toBe(1);
  });

  it("should sort by Name ascending", () => {
    const config: SortConfig = { field: "name", direction: "asc" };
    const sorted = sortItems(mockItems, config);
    expect(sorted[0].name).toBe("Bulbasaur");
    expect(sorted[1].name).toBe("Charmander");
    expect(sorted[2].name).toBe("Pikachu");
    expect(sorted[3].name).toBe("Squirtle");
  });

  it("should sort by Name descending", () => {
    const config: SortConfig = { field: "name", direction: "desc" };
    const sorted = sortItems(mockItems, config);
    expect(sorted[0].name).toBe("Squirtle");
    expect(sorted[1].name).toBe("Pikachu");
    expect(sorted[2].name).toBe("Charmander");
    expect(sorted[3].name).toBe("Bulbasaur");
  });

  it("should sort by HP ascending", () => {
    const config: SortConfig = { field: "hp", direction: "asc" };
    const sorted = sortItems(mockItems, config);
    expect(sorted[0].hp).toBe(35);
    expect(sorted[1].hp).toBe(39);
    expect(sorted[2].hp).toBe(44);
    expect(sorted[3].hp).toBe(45);
  });

  it("should maintain stability with ID as tie-breaker (ascending)", () => {
    const tieItems: SortableItem[] = [
      { id: 10, name: "Pokemon B", hp: 50 },
      { id: 5, name: "Pokemon A", hp: 50 },
      { id: 15, name: "Pokemon C", hp: 50 },
    ];
    const config: SortConfig = { field: "hp", direction: "asc" };
    const sorted = sortItems(tieItems, config);

    // All HP are 50, so should be sorted by ID ascending
    expect(sorted[0].id).toBe(5);
    expect(sorted[1].id).toBe(10);
    expect(sorted[2].id).toBe(15);
  });

  it("should maintain stability with ID as tie-breaker (descending)", () => {
    const tieItems: SortableItem[] = [
      { id: 10, name: "Pokemon B", hp: 50 },
      { id: 5, name: "Pokemon A", hp: 50 },
      { id: 15, name: "Pokemon C", hp: 50 },
    ];
    const config: SortConfig = { field: "hp", direction: "desc" };
    const sorted = sortItems(tieItems, config);

    // All HP are 50, so should STILL be sorted by ID ascending
    expect(sorted[0].id).toBe(5);
    expect(sorted[1].id).toBe(10);
    expect(sorted[2].id).toBe(15);
  });

  it("should handle missing optional fields by treating them as 0 or empty string", () => {
    const missingItems: SortableItem[] = [
      { id: 1, name: "A", attack: 10 },
      { id: 2, name: "B" }, // missing attack
      { id: 3, name: "C", attack: 5 },
    ];
    const config: SortConfig = { field: "attack", direction: "asc" };
    const sorted = sortItems(missingItems, config);

    expect(sorted[0].id).toBe(2); // attack: undefined -> 0
    expect(sorted[1].id).toBe(3); // attack: 5
    expect(sorted[2].id).toBe(1);
    expect(sorted[2].attack).toBe(10);
  });

  it("should return a new array and not mutate the original", () => {
    const original = [...mockItems];
    const config: SortConfig = { field: "name", direction: "asc" };
    const sorted = sortItems(mockItems, config);

    expect(sorted).not.toBe(mockItems);
    expect(mockItems).toEqual(original);
  });

  it("should handle empty arrays", () => {
    const sorted = sortItems([], { field: "id", direction: "asc" });
    expect(sorted).toEqual([]);
  });

  it("should handle single-item arrays", () => {
    const single = [{ id: 1, name: "Bulbasaur" }];
    const sorted = sortItems(single, { field: "id", direction: "asc" });
    expect(sorted).toEqual(single);
    expect(sorted).not.toBe(single); // should still be a new array
  });

  it("should handle invalid sort fields gracefully with a warning", () => {
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const config = { field: "invalid" as any, direction: "asc" as any };
    const sorted = sortItems(mockItems, config);

    expect(consoleSpy).toHaveBeenCalled();
    expect(sorted).toEqual(mockItems); // returns copy of original
    consoleSpy.mockRestore();
  });
});
