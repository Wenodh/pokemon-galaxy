import { describe, it, expect, vi, beforeEach } from "vitest";
import { TeamExporter } from "../domain/exporter";
import { TeamImporter } from "../domain/importer";
import { ShowdownParser } from "../domain/showdown-parser";
import { TeamValidator } from "../domain/validators";
import { PokedexRepository } from "@/features/pokedex/services/pokedex-repository";

// Mock PokedexRepository
vi.mock("@/features/pokedex/services/pokedex-repository", () => ({
  PokedexRepository: {
    getPokemonByName: vi.fn(),
  },
}));

describe("Team Import & Export", () => {
  const mockTeam = {
    id: "123",
    name: "Test Team",
    pokemon: [1, 4, 7],
    createdAt: 1000,
    updatedAt: 1000,
  };

  const mockPokemonList = [
    { id: 1, name: "Bulbasaur", types: ["Grass", "Poison"], image: "" },
    { id: 4, name: "Charmander", types: ["Fire"], image: "" },
    { id: 7, name: "Squirtle", types: ["Water"], image: "" },
  ];

  describe("TeamExporter", () => {
    it("should export to JSON correctly", () => {
      const json = TeamExporter.exportToJson(mockTeam);
      const parsed = JSON.parse(json);
      expect(parsed.version).toBe(1);
      expect(parsed.team.name).toBe("Test Team");
      expect(parsed.team.pokemon).toEqual([1, 4, 7]);
    });

    it("should export to Showdown correctly", () => {
      const showdown = TeamExporter.exportToShowdown("Test Team", mockPokemonList as any);
      expect(showdown).toContain("=== Test Team ===");
      expect(showdown).toContain("Bulbasaur");
      expect(showdown).toContain("Level: 100");
    });
  });

  describe("ShowdownParser", () => {
    it("should parse basic Showdown text", () => {
      const text = `=== My Showdown Team ===

      Pikachu
      Level: 100

      Charizard (Flame) @ Leftovers
      - Flamethrower
      `;
      const parsed = ShowdownParser.parse(text);
      expect(parsed.name).toBe("My Showdown Team");
      expect(parsed.pokemonNames).toEqual(["Pikachu", "Charizard"]);
    });
  });

  describe("TeamImporter", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should import valid JSON", async () => {
      const json = TeamExporter.exportToJson(mockTeam);
      const result = await TeamImporter.importFromJson(json);
      expect(result.success).toBe(true);
      expect(result.team?.name).toBe("Test Team");
      expect(result.team?.pokemonIds).toEqual([1, 4, 7]);
    });

    it("should return error for invalid JSON", async () => {
      const result = await TeamImporter.importFromJson("not json");
      expect(result.success).toBe(false);
      expect(result.errors[0].code).toBe("INVALID_JSON");
    });

    it("should import valid Showdown text", async () => {
      (PokedexRepository.getPokemonByName as any)
        .mockResolvedValueOnce({ id: 25, name: "Pikachu" })
        .mockResolvedValueOnce({ id: 6, name: "Charizard" });

      const text = "Pikachu\n\nCharizard";
      const result = await TeamImporter.importFromShowdown(text);

      expect(result.success).toBe(true);
      expect(result.team?.pokemonIds).toEqual([25, 6]);
    });

    it("should handle unknown pokemon in Showdown", async () => {
      (PokedexRepository.getPokemonByName as any).mockResolvedValue(null);

      const text = "MissingNo";
      const result = await TeamImporter.importFromShowdown(text);

      expect(result.success).toBe(false);
      expect(result.errors[0].code).toBe("UNKNOWN_POKEMON");
    });
  });

  describe("TeamValidator", () => {
    it("should validate duplicate pokemon", () => {
        const data = {
            version: 1,
            team: {
                name: "Dupes",
                pokemon: [1, 1]
            }
        };
        const result = TeamValidator.validateJson(data);
        expect(result.success).toBe(false);
        expect(result.errors.some(e => e.code === "DUPLICATE_POKEMON")).toBe(true);
    });

    it("should validate team size", () => {
        const data = {
            version: 1,
            team: {
                name: "Big Team",
                pokemon: [1, 2, 3, 4, 5, 6, 7]
            }
        };
        const result = TeamValidator.validateJson(data);
        expect(result.success).toBe(false);
        expect(result.errors.some(e => e.code === "TEAM_TOO_LARGE")).toBe(true);
    });
  });
});
