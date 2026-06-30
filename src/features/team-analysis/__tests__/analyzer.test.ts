import { describe, it, expect } from "vitest";
import { analyzeTeam } from "../domain/analyzer";
import { PokemonDetails } from "@/features/pokemon/types";

const mockPokemon = (overrides: Partial<PokemonDetails> = {}): PokemonDetails => ({
  id: 1,
  name: "Bulbasaur",
  height: 7,
  weight: 69,
  baseExperience: 64,
  types: ["Grass", "Poison"],
  typeIds: [12, 4],
  stats: [
    { name: "hp", value: 45 },
    { name: "attack", value: 49 },
    { name: "defense", value: 49 },
    { name: "special-attack", value: 65 },
    { name: "special-defense", value: 65 },
    { name: "speed", value: 45 },
  ],
  abilities: [],
  image: "",
  genus: "Seed",
  generation: "Generation I",
  generationId: 1,
  flavorText: "",
  evolutionChainId: 1,
  moves: [],
  ...overrides,
});

describe("Team Analysis Engine", () => {
  it("should handle an empty team", () => {
    const analysis = analyzeTeam([]);
    expect(analysis.averageStats.bst).toBe(0);
    expect(analysis.warnings).toHaveLength(0);
    expect(analysis.missingTypes).toHaveLength(18);
  });

  it("should calculate average stats correctly", () => {
    const team = [
      mockPokemon({ stats: [{ name: "hp", value: 100 }, { name: "attack", value: 100 }, { name: "defense", value: 100 }, { name: "special-attack", value: 100 }, { name: "special-defense", value: 100 }, { name: "speed", value: 100 }] }),
      mockPokemon({ stats: [{ name: "hp", value: 50 }, { name: "attack", value: 50 }, { name: "defense", value: 50 }, { name: "special-attack", value: 50 }, { name: "special-defense", value: 50 }, { name: "speed", value: 50 }] }),
    ];
    const analysis = analyzeTeam(team);
    expect(analysis.averageStats.hp).toBe(75);
    expect(analysis.averageStats.bst).toBe(450);
  });

  it("should detect duplicate types", () => {
    const team = [
      mockPokemon({ name: "P1", types: ["Fire"] }),
      mockPokemon({ name: "P2", types: ["Fire", "Flying"] }),
    ];
    const analysis = analyzeTeam(team);
    const fireDuplicate = analysis.duplicateTypes.find(dt => dt.type === "fire");
    expect(fireDuplicate).toBeDefined();
    expect(fireDuplicate?.count).toBe(2);
  });

  it("should generate warnings for too many duplicate types", () => {
    const team = [
      mockPokemon({ name: "P1", types: ["Fire"] }),
      mockPokemon({ name: "P2", types: ["Fire"] }),
      mockPokemon({ name: "P3", types: ["Fire"] }),
    ];
    const analysis = analyzeTeam(team);
    expect(analysis.warnings.some(w => w.type === "DUPLICATE_TYPE")).toBe(true);
  });

  it("should detect shared team weaknesses", () => {
    const team = [
      mockPokemon({ name: "P1", types: ["Fire"] }), // Weak to Water, Ground, Rock
      mockPokemon({ name: "P2", types: ["Fire"] }),
      mockPokemon({ name: "P3", types: ["Fire"] }),
    ];
    const analysis = analyzeTeam(team);
    const waterWeakness = analysis.weaknesses.find(w => w.type === "water");
    expect(waterWeakness?.count).toBe(3);
    expect(analysis.warnings.some(w => w.type === "TEAM_WEAKNESS" && w.affectedTypes?.includes("water"))).toBe(true);
  });

  it("should detect offensive coverage gaps", () => {
      // Normal types only hit nothing super effectively
      const team = [
          mockPokemon({ name: "P1", types: ["Normal"], moves: [] })
      ];
      const analysis = analyzeTeam(team);
      expect(analysis.missingTypes).toHaveLength(18); // All 18 types are missing super-effective coverage
  });

  it("should identify Pokémon roles correctly", () => {
      const sweeper = mockPokemon({
          name: "Sweeper",
          stats: [
              { name: "hp", value: 70 },
              { name: "attack", value: 130 },
              { name: "defense", value: 60 },
              { name: "special-attack", value: 60 },
              { name: "special-defense", value: 60 },
              { name: "speed", value: 110 },
          ]
      });
      const analysis = analyzeTeam([sweeper]);
      expect(analysis.pokemonRoles["Sweeper"]).toBe("Physical Sweeper");
  });

  it("should identify Ground immunity requirement", () => {
      const team = [
          mockPokemon({ types: ["Fire"] }),
          mockPokemon({ types: ["Electric"] }),
          mockPokemon({ types: ["Poison"] }),
      ];
      const analysis = analyzeTeam(team);
      expect(analysis.warnings.some(w => w.type === "NO_GROUND_IMMUNITY")).toBe(true);

      const teamWithBird = [
          ...team,
          mockPokemon({ types: ["Flying"] })
      ];
      const analysisWithBird = analyzeTeam(teamWithBird);
      expect(analysisWithBird.warnings.some(w => w.type === "NO_GROUND_IMMUNITY")).toBe(false);
  });
});
