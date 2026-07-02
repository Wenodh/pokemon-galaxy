import { describe, it, expect, vi } from "vitest";
import { TeamExporter } from "../domain/exporter";
import { TeamImporter } from "../domain/importer";
import { ShowdownParser } from "../domain/showdown-parser";
import { TeamValidator } from "../domain/validators";
import { PokedexRepository } from "@/features/pokedex/services/pokedex-repository";
import { normalizePokemonName } from "../utils/normalization";

// Mock PokedexRepository
vi.mock("@/features/pokedex/services/pokedex-repository", () => ({
  PokedexRepository: {
    getPokemonByName: vi.fn(),
  },
}));

describe("Advanced Team Import & Export", () => {
  const mockTeam = {
    id: "123",
    name: "Competitive Team",
    pokemon: [1, 4],
    competitive: [
      {
        pokemonId: 1,
        nickname: "Bulba",
        gender: "M" as const,
        level: 50,
        item: "Eviolite",
        ability: "Overgrow",
        nature: "Bold",
        evs: { hp: 252, def: 252, spd: 4 },
        moves: ["Tackle", "Growl"],
      },
      {
        pokemonId: 4,
        shiny: true,
        teraType: "Fire",
        moves: ["Ember"],
      },
    ],
    createdAt: 1000,
    updatedAt: 1000,
  };

  const mockPokemonDetails = [
    { id: 1, name: "Bulbasaur", types: ["Grass", "Poison"], image: "" },
    { id: 4, name: "Charmander", types: ["Fire"], image: "" },
  ];

  describe("Normalization", () => {
    it("should normalize tricky names", () => {
      expect(normalizePokemonName("Ho-Oh")).toBe("ho-oh");
      expect(normalizePokemonName("Mr. Mime")).toBe("mr-mime");
      expect(normalizePokemonName("Tapu Koko")).toBe("tapu-koko");
      expect(normalizePokemonName("Sirfetch'd")).toBe("sirfetch-d");
      expect(normalizePokemonName("Type: Null")).toBe("type-null");
      expect(normalizePokemonName("Great Tusk")).toBe("great-tusk");
    });
  });

  describe("ShowdownParser", () => {
    it("should parse full competitive Showdown text", () => {
      const text = `=== My Team ===

Bulba (Bulbasaur) (M) @ Eviolite
Ability: Overgrow
Level: 50
EVs: 252 HP / 252 Def / 4 SpD
Bold Nature
- Tackle
- Growl

Charmander
Shiny: Yes
Tera Type: Fire
- Ember
`;
      const parsed = ShowdownParser.parse(text);
      expect(parsed.name).toBe("My Team");
      expect(parsed.pokemon).toHaveLength(2);

      const p1 = parsed.pokemon[0];
      expect(p1.nickname).toBe("Bulba");
      expect(p1.species).toBe("Bulbasaur");
      expect(p1.gender).toBe("M");
      expect(p1.item).toBe("Eviolite");
      expect(p1.ability).toBe("Overgrow");
      expect(p1.level).toBe(50);
      expect(p1.nature).toBe("Bold");
      expect(p1.evs).toEqual({ hp: 252, def: 252, spd: 4 });
      expect(p1.moves).toEqual(["Tackle", "Growl"]);

      const p2 = parsed.pokemon[1];
      expect(p2.species).toBe("Charmander");
      expect(p2.shiny).toBe(true);
      expect(p2.teraType).toBe("Fire");
      expect(p2.moves).toEqual(["Ember"]);
    });
  });

  describe("TeamExporter", () => {
    it("should export full competitive data to Showdown", () => {
      const showdown = TeamExporter.exportToShowdown(
        mockTeam.name,
        mockPokemonDetails as any,
        mockTeam.competitive as any
      );

      expect(showdown).toContain("Bulba (Bulbasaur) (M) @ Eviolite");
      expect(showdown).toContain("Ability: Overgrow");
      expect(showdown).toContain("Level: 50");
      expect(showdown).toContain("EVs: 252 HP / 252 Def / 4 SpD");
      expect(showdown).toContain("Bold Nature");
      expect(showdown).toContain("- Tackle");
      expect(showdown).toContain("Shiny: Yes");
      expect(showdown).toContain("Tera Type: Fire");
    });

    it("should sanitize filenames", () => {
        expect(TeamExporter.getSanitizedFilename("My Team?")).toBe("My Team-.txt");
        expect(TeamExporter.getSanitizedFilename("OU/UU Balance")).toBe("OU-UU Balance.txt");
    });
  });

  describe("TeamValidator", () => {
    it("should validate EV ranges", () => {
        const parsed: any = {
            name: "Test",
            pokemon: [{
                species: "Pikachu",
                evs: { hp: 253 } // Invalid
            }]
        };
        const result = TeamValidator.validateShowdownResults(parsed, [25]);
        expect(result.success).toBe(false);
        expect(result.errors.some(e => e.code === "INVALID_EV_RANGE")).toBe(true);
    });

    it("should validate EV total", () => {
        const parsed: any = {
            name: "Test",
            pokemon: [{
                species: "Pikachu",
                evs: { hp: 252, atk: 252, def: 8 } // Total 512
            }]
        };
        const result = TeamValidator.validateShowdownResults(parsed, [25]);
        expect(result.success).toBe(false);
        expect(result.errors.some(e => e.code === "INVALID_EV_RANGE")).toBe(true);
    });

    it("should validate IV ranges", () => {
        const parsed: any = {
            name: "Test",
            pokemon: [{
                species: "Pikachu",
                ivs: { hp: 32 } // Invalid
            }]
        };
        const result = TeamValidator.validateShowdownResults(parsed, [25]);
        expect(result.success).toBe(false);
        expect(result.errors.some(e => e.code === "INVALID_IV_RANGE")).toBe(true);
    });

    it("should validate Tera Type", () => {
        const parsed: any = {
            name: "Test",
            pokemon: [{
                species: "Pikachu",
                teraType: "Nuclear" // Invalid
            }]
        };
        const result = TeamValidator.validateShowdownResults(parsed, [25]);
        expect(result.success).toBe(false);
        expect(result.errors.some(e => e.code === "INVALID_TERA_TYPE")).toBe(true);
    });
  });

  describe("Round-trip consistency", () => {
    it("should maintain data through import -> export cycle", async () => {
      (PokedexRepository.getPokemonByName as any)
        .mockResolvedValueOnce(mockPokemonDetails[0])
        .mockResolvedValueOnce(mockPokemonDetails[1]);

      const originalShowdown = TeamExporter.exportToShowdown(
        mockTeam.name,
        mockPokemonDetails as any,
        mockTeam.competitive as any
      );

      const importResult = await TeamImporter.importFromShowdown(originalShowdown);
      expect(importResult.success).toBe(true);

      const exportedShowdown = TeamExporter.exportToShowdown(
        importResult.team!.name,
        mockPokemonDetails as any,
        importResult.team!.competitive as any
      );

      // Compare some key parts to ensure consistency
      expect(exportedShowdown).toContain("Bulba (Bulbasaur)");
      expect(exportedShowdown).toContain("EVs: 252 HP / 252 Def / 4 SpD");
      expect(exportedShowdown).toContain("Shiny: Yes");
    });
  });
});
