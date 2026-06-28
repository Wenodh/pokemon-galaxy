import { describe, it, expect } from "vitest";
import { PokemonListItem } from "@/features/pokedex/types";
import { filterPokemon, sortPokemon } from "../utils/favorites.sorting";

const mockPokemon: PokemonListItem[] = [
  { id: 1, name: "bulbasaur", types: ["grass", "poison"], image: "" },
  { id: 4, name: "charmander", types: ["fire"], image: "" },
  { id: 7, name: "squirtle", types: ["water"], image: "" },
  { id: 25, name: "pikachu", types: ["electric"], image: "" },
];

describe("Favorites Page Logic (Utils)", () => {
  describe("Search", () => {
    it("should filter by name", () => {
      const result = filterPokemon(mockPokemon, "pika");
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("pikachu");
    });

    it("should filter by ID", () => {
      const result = filterPokemon(mockPokemon, "7");
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(7);
    });

    it("should return empty if no match", () => {
      const result = filterPokemon(mockPokemon, "mewtwo");
      expect(result).toHaveLength(0);
    });

    it("should be case-insensitive", () => {
      const result = filterPokemon(mockPokemon, "BULBA");
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("bulbasaur");
    });
  });

  describe("Sorting", () => {
    it("should sort by number ascending", () => {
      const result = sortPokemon(mockPokemon, "number-asc");
      expect(result[0].id).toBe(1);
      expect(result[result.length - 1].id).toBe(25);
    });

    it("should sort by number descending", () => {
      const result = sortPokemon(mockPokemon, "number-desc");
      expect(result[0].id).toBe(25);
      expect(result[result.length - 1].id).toBe(1);
    });

    it("should sort by name ascending", () => {
      const result = sortPokemon(mockPokemon, "name-asc");
      expect(result[0].name).toBe("bulbasaur");
      expect(result[result.length - 1].name).toBe("squirtle");
    });

    it("should sort by name descending", () => {
      const result = sortPokemon(mockPokemon, "name-desc");
      expect(result[0].name).toBe("squirtle");
      expect(result[result.length - 1].name).toBe("bulbasaur");
    });
  });
});
