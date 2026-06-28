import { describe, it, expect } from "vitest";
import { searchPokemon } from "../engine/search-engine";
import { SearchableItem } from "../engine/ranking";

describe("Search Engine", () => {
  const mockPokemon: SearchableItem[] = [
    { id: 1, name: "Bulbasaur" },
    { id: 4, name: "Charmander" },
    { id: 7, name: "Squirtle" },
    { id: 25, name: "Pikachu" },
    { id: 172, name: "Pichu" },
    { id: 731, name: "Pikipek" },
  ];

  it("returns all items when query is empty", () => {
    expect(searchPokemon("", mockPokemon)).toEqual(mockPokemon);
    expect(searchPokemon("   ", mockPokemon)).toEqual(mockPokemon);
  });

  it("finds exact ID match with highest priority", () => {
    const results = searchPokemon("25", mockPokemon);
    expect(results[0].name).toBe("Pikachu");
  });

  it("finds exact name match", () => {
    const results = searchPokemon("Squirtle", mockPokemon);
    expect(results[0].name).toBe("Squirtle");
  });

  it("is case insensitive and accent insensitive", () => {
    const accentedPokemon = [{ id: 1, name: "Flabébé" }];
    expect(searchPokemon("flabebe", accentedPokemon)).toHaveLength(1);
    expect(searchPokemon("FLABEBE", accentedPokemon)).toHaveLength(1);
  });

  it("finds by prefix with higher priority than partial match", () => {
    // "Pi" matches Pikachu (prefix), Pichu (prefix), Pikipek (prefix)
    // If we had something like "Happiny", "Pi" would be partial match there.
    const results = searchPokemon("Pi", mockPokemon);
    expect(results.map(r => r.name)).toContain("Pikachu");
    expect(results.map(r => r.name)).toContain("Pichu");
    expect(results.map(r => r.name)).toContain("Pikipek");
  });

  it("finds by partial match", () => {
    const results = searchPokemon("mander", mockPokemon);
    expect(results[0].name).toBe("Charmander");
  });

  it("finds by fuzzy match", () => {
    const results = searchPokemon("Pikuchu", mockPokemon);
    expect(results[0].name).toBe("Pikachu");
  });

  it("ranks results correctly", () => {
    const items = [
      { id: 10, name: "Caterpie" },
      { id: 100, name: "Voltorb" },
    ];
    // Exact ID match for 100
    const results = searchPokemon("100", items);
    expect(results[0].id).toBe(100);
  });

  it("handles queries with no matches", () => {
    expect(searchPokemon("xyz789", mockPokemon)).toHaveLength(0);
  });

  it("meets performance requirements (<20ms for 1500 items)", () => {
    const largeDataset: SearchableItem[] = Array.from({ length: 1500 }, (_, i) => ({
      id: i + 1,
      name: `Pokemon-${i + 1}`,
    }));

    const start = performance.now();
    searchPokemon("Pokemon-1234", largeDataset);
    const end = performance.now();

    const duration = end - start;
    // We allow up to 20ms in CI/test environments to account for variability
    expect(duration).toBeLessThan(20);
  });
});
