import { describe, it, expect } from "vitest";
import { applyFilters, combineFilters } from "../engine/filter-engine";
import { buildFilter } from "../engine/filter-builder";
import { serializeFiltersToUrl } from "../utils/serialize";
import { deserializeFiltersFromUrl } from "../utils/deserialize";

describe("Filter Engine", () => {
  const mockPokemon = [
    { id: 1, name: "Bulbasaur", types: ["Grass", "Poison"], hp: 45, attack: 49, generation: 1, isLegendary: false },
    { id: 4, name: "Charmander", types: ["Fire"], hp: 39, attack: 52, generation: 1, isLegendary: false },
    { id: 6, name: "Charizard", types: ["Fire", "Flying"], hp: 78, attack: 84, generation: 1, isLegendary: false },
    { id: 150, name: "Mewtwo", types: ["Psychic"], hp: 106, attack: 110, generation: 1, isLegendary: true },
    { id: 252, name: "Treecko", types: ["Grass"], hp: 40, attack: 45, generation: 3, isLegendary: false },
  ];

  it("filters by identity", () => {
    const filters = buildFilter().add("id", "=", 150).build();
    const results = applyFilters(mockPokemon, filters);
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe("Mewtwo");
  });

  it("filters by types (includesAny)", () => {
    const filters = buildFilter().add("types", "includesAny", ["Fire", "Grass"]).build();
    const results = applyFilters(mockPokemon, filters);
    expect(results).toHaveLength(4); // Bulbasaur, Charmander, Charizard, Treecko
  });

  it("filters by numeric comparisons", () => {
    const filters = buildFilter().add("attack", ">", 100).build();
    const results = applyFilters(mockPokemon, filters);
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe("Mewtwo");
  });

  it("filters with AND logic", () => {
    const filters = buildFilter()
      .add("generation", "=", 1)
      .add("isLegendary", "is", true)
      .build();
    const results = applyFilters(mockPokemon, filters);
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe("Mewtwo");
  });

  it("filters with OR logic", () => {
    const filters = buildFilter("or")
      .add("name", "equals", "Bulbasaur")
      .add("name", "equals", "Treecko")
      .build();
    const results = applyFilters(mockPokemon, filters);
    expect(results).toHaveLength(2);
  });

  it("filters with nested groups", () => {
    // (Type = Fire OR Type = Grass) AND Generation = 3
    const typeGroup = buildFilter("or")
      .add("types", "includes", "Fire")
      .add("types", "includes", "Grass");

    const filters = buildFilter("and")
      .addGroup(typeGroup)
      .add("generation", "=", 3)
      .build();

    const results = applyFilters(mockPokemon, filters);
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe("Treecko");
  });

  it("serializes and deserializes correctly", () => {
    const filters = buildFilter().add("hp", "between", [40, 50]).build();
    const urlString = serializeFiltersToUrl(filters);
    const recovered = deserializeFiltersFromUrl(urlString);

    expect(recovered).toEqual(filters);

    const results = applyFilters(mockPokemon, recovered!);
    expect(results).toHaveLength(2); // Bulbasaur (45), Treecko (40)
  });

  it("handles empty filters by returning all data", () => {
    const filters = buildFilter().build();
    expect(applyFilters(mockPokemon, filters)).toHaveLength(mockPokemon.length);
  });

  it("combines multiple filter states", () => {
    const f1 = buildFilter().add("generation", "=", 1).build();
    const f2 = buildFilter().add("isLegendary", "is", false).build();

    const combined = combineFilters(f1, f2);
    const results = applyFilters(mockPokemon, combined);
    expect(results).toHaveLength(3); // Bulbasaur, Charmander, Charizard
  });

  it("is performance efficient for 1500 items", () => {
    const largeDataset = Array.from({ length: 1500 }, (_, i) => ({
      id: i + 1,
      attack: i,
      generation: Math.floor(i / 150) + 1,
    }));

    const filters = buildFilter()
      .add("attack", ">", 1000)
      .add("generation", "=", 8)
      .build();

    const start = performance.now();
    applyFilters(largeDataset, filters);
    const end = performance.now();

    expect(end - start).toBeLessThan(5);
  });
});
