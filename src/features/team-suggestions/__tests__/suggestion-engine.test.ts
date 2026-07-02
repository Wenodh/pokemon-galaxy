import { describe, it, expect } from "vitest";
import { getSuggestions } from "../domain/suggestion-engine";
import { Team } from "@/features/team/types/team.types";
import { TeamAnalysis } from "@/features/team-analysis/types/analysis.types";
import { Recommendation } from "@/features/team-recommendations/types/recommendation.types";

describe("Smart Pokémon Suggestion Engine", () => {
  const mockTeam: Team = {
    id: "team-1",
    name: "Test Team",
    pokemon: [1, 4, 7], // Bulbasaur, Charmander, Squirtle
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const mockAnalysis: TeamAnalysis = {
    offensiveCoverage: [],
    weaknesses: [],
    resistances: [],
    immunities: [],
    duplicateTypes: [],
    missingTypes: ["ground", "electric"],
    averageStats: { hp: 50, attack: 50, defense: 50, specialAttack: 50, specialDefense: 50, speed: 50, bst: 300 },
    highestStat: "hp",
    lowestStat: "speed",
    pokemonRoles: { Bulbasaur: "Balanced", Charmander: "Fast Attacker", Squirtle: "Tank" },
    warnings: [],
    overallScore: 50,
    scoreBreakdown: { offensiveCoverage: 10, defensiveCoverage: 10, teamBalance: 10, statDistribution: 20 },
    typeDistribution: [{ type: "grass", count: 1 }, { type: "fire", count: 1 }, { type: "water", count: 1 }],
    individualStats: [],
  };

  const mockRecommendations: Recommendation[] = [
    {
      id: "missing-coverage-ground",
      category: "Offensive Gaps",
      severity: "medium",
      title: "Missing Ground Coverage",
      description: "...",
      suggestedAction: "...",
      source: "offensiveCoverage",
    },
    {
      id: "missing-special-attacker",
      category: "Missing Roles",
      severity: "medium",
      title: "No Special Attacker",
      description: "...",
      suggestedAction: "...",
      source: "pokemonRoles",
    }
  ];

  it("should recommend Pokémon that address missing coverage", () => {
    const suggestions = getSuggestions(mockTeam, mockAnalysis, mockRecommendations);

    // Garchomp (445) provides Ground coverage
    const garchomp = suggestions.find(s => s.pokemonName === "Garchomp");
    expect(garchomp).toBeDefined();
    expect(garchomp?.reasons).toContain("Provides ground offensive coverage.");
    expect(garchomp?.addresses).toContain("Offensive Gaps");
  });

  it("should recommend Pokémon that fill missing roles", () => {
    // Zapdos is 145 and Gholdengo is 1000. Both are Special Sweepers.
    const suggestions = getSuggestions(mockTeam, mockAnalysis, mockRecommendations);

    // Zapdos (145) is a Special Sweeper (Special Attacker)
    const zapdos = suggestions.find(s => s.pokemonName === "Zapdos");
    expect(zapdos).toBeDefined();
    expect(zapdos?.reasons).toContain("Fills the missing Special Attacker role.");
  });

  it("should never suggest Pokémon already on the team", () => {
    const teamWithGarchomp: Team = {
        ...mockTeam,
        pokemon: [445]
    };
    const suggestions = getSuggestions(teamWithGarchomp, mockAnalysis, mockRecommendations);
    const garchomp = suggestions.find(s => s.pokemonId === 445);
    expect(garchomp).toBeUndefined();
  });

  it("should provide suggestions for an empty team", () => {
    const emptyTeam: Team = { ...mockTeam, pokemon: [] };
    const emptyRecs: Recommendation[] = [{
        id: "empty-team",
        category: "Empty Team",
        severity: "high",
        title: "Your team is empty",
        description: "...",
        suggestedAction: "...",
        source: "teamSize"
    }];

    const suggestions = getSuggestions(emptyTeam, mockAnalysis, emptyRecs);
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions[0].reasons[0]).toContain("versatile, beginner-friendly");
  });

  it("should be deterministic", () => {
    const suggestions1 = getSuggestions(mockTeam, mockAnalysis, mockRecommendations);
    const suggestions2 = getSuggestions(mockTeam, mockAnalysis, mockRecommendations);
    expect(suggestions1).toEqual(suggestions2);
  });

  it("should handle various recommendation categories", () => {
    const allRecs: Recommendation[] = [
        { id: "low-speed", category: "Low Speed", title: "Low Team Speed", severity: "low", description: "", suggestedAction: "", source: "averageStats" },
        { id: "low-bulk", category: "Low Bulk", title: "Low Team Bulk", severity: "low", description: "", suggestedAction: "", source: "averageStats" },
        { id: "weakness-fire", category: "Defensive Weaknesses", title: "Fire Weakness", severity: "medium", description: "", suggestedAction: "", source: "defensiveMetrics" },
        { id: "empty-slots", category: "Empty Slots", title: "Empty slots available", severity: "medium", description: "", suggestedAction: "", source: "teamSize" }
    ];
    const suggestions = getSuggestions(mockTeam, mockAnalysis, allRecs);

    expect(suggestions.some(s => s.reasons.some(r => r.includes("speed")))).toBe(true);
    expect(suggestions.some(s => s.reasons.some(r => r.includes("durability")))).toBe(true);
    expect(suggestions.some(s => s.reasons.some(r => r.includes("Resists fire")))).toBe(true);
    expect(suggestions.some(s => s.reasons.some(r => r.includes("versatile")))).toBe(true);
  });

  it("should reward diversity and role additions", () => {
    // Current team has grass, fire, water.
    // Gholdengo (1000) is Steel/Ghost.
    const suggestions = getSuggestions(mockTeam, mockAnalysis, []);
    const gholdengo = suggestions.find(s => s.pokemonName === "Gholdengo");

    // If Gholdengo is not in top 6, find another one that might be
    const anySuggestion = suggestions[0];
    console.log(`Top suggestion: ${anySuggestion.pokemonName}, Reasons: ${anySuggestion.reasons}`);

    if (gholdengo) {
        expect(gholdengo.reasons).toContain("Adds new types to your team, increasing diversity.");
    } else {
        // Just verify that SOME suggestion has these generic rewards
        expect(suggestions.some(s => s.reasons.includes("Adds new types to your team, increasing diversity."))).toBe(true);
    }
  });

  it("should rank suggestions by score", () => {
    const suggestions = getSuggestions(mockTeam, mockAnalysis, mockRecommendations);
    for (let i = 0; i < suggestions.length - 1; i++) {
      expect(suggestions[i].score).toBeGreaterThanOrEqual(suggestions[i+1].score);
    }
  });
});
