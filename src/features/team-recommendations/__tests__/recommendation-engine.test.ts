import { describe, it, expect } from "vitest";
import { generateRecommendations } from "../domain/recommendation-engine";
import { TeamAnalysis } from "@/features/team-analysis/types/analysis.types";

const mockEmptyAnalysis: TeamAnalysis = {
    offensiveCoverage: [],
    weaknesses: [],
    resistances: [],
    immunities: [],
    duplicateTypes: [],
    missingTypes: [],
    averageStats: { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0, bst: 0 },
    highestStat: "N/A",
    lowestStat: "N/A",
    pokemonRoles: {},
    warnings: [],
    overallScore: 0,
    scoreBreakdown: { offensiveCoverage: 0, defensiveCoverage: 0, teamBalance: 0, statDistribution: 0 },
    typeDistribution: [],
    individualStats: []
};

describe("Recommendation Engine", () => {
  it("generates a high severity recommendation for an empty team", () => {
    const recommendations = generateRecommendations(mockEmptyAnalysis, 0);
    expect(recommendations).toHaveLength(1);
    expect(recommendations[0].category).toBe("Empty Team");
    expect(recommendations[0].severity).toBe("high");
  });

  it("generates an Empty Slots recommendation for a partial team", () => {
    const recommendations = generateRecommendations(mockEmptyAnalysis, 3);
    const emptySlots = recommendations.find(r => r.category === "Empty Slots");
    expect(emptySlots).toBeDefined();
    expect(emptySlots?.severity).toBe("medium");
  });

  it("generates role recommendations when key roles are missing", () => {
    const analysis = { ...mockEmptyAnalysis, pokemonRoles: { "Pikachu": "Fast Attacker" as const } };
    const recommendations = generateRecommendations(analysis, 1);

    expect(recommendations.some(r => r.title === "No Physical Attacker")).toBe(true);
    expect(recommendations.some(r => r.title === "No Special Attacker")).toBe(true);
    expect(recommendations.some(r => r.title === "No Tank or Wall")).toBe(true);
  });

  it("detects defensive weaknesses", () => {
    const analysis = {
        ...mockEmptyAnalysis,
        weaknesses: [{ type: "fire", multiplier: 2, count: 3 }]
    };
    const recommendations = generateRecommendations(analysis, 3);
    const fireWeakness = recommendations.find(r => r.title === "Fire Weakness");
    expect(fireWeakness).toBeDefined();
    expect(fireWeakness?.severity).toBe("medium");
  });

  it("detects high severity defensive weaknesses (4+ shared)", () => {
    const analysis = {
        ...mockEmptyAnalysis,
        weaknesses: [{ type: "water", multiplier: 2, count: 4 }]
    };
    const recommendations = generateRecommendations(analysis, 4);
    const waterWeakness = recommendations.find(r => r.title === "Water Weakness");
    expect(waterWeakness?.severity).toBe("high");
  });

  it("detects duplicate types", () => {
    const analysis = {
        ...mockEmptyAnalysis,
        duplicateTypes: [{ type: "grass", count: 3 }]
    };
    const recommendations = generateRecommendations(analysis, 3);
    const grassDup = recommendations.find(r => r.category === "Duplicate Types");
    expect(grassDup).toBeDefined();
    expect(grassDup?.severity).toBe("medium");
  });

  it("detects low speed", () => {
    const analysis = {
        ...mockEmptyAnalysis,
        averageStats: { ...mockEmptyAnalysis.averageStats, speed: 60 }
    };
    const recommendations = generateRecommendations(analysis, 6);
    expect(recommendations.some(r => r.category === "Low Speed")).toBe(true);
  });

  it("detects low bulk", () => {
    const analysis = {
        ...mockEmptyAnalysis,
        averageStats: { ...mockEmptyAnalysis.averageStats, hp: 60, defense: 60, specialDefense: 60 }
    };
    const recommendations = generateRecommendations(analysis, 6);
    expect(recommendations.some(r => r.category === "Low Bulk")).toBe(true);
  });

  it("ranks recommendations by severity and then priority", () => {
    const analysis = {
        ...mockEmptyAnalysis,
        weaknesses: [{ type: "fire", multiplier: 2, count: 4 }], // High severity
        averageStats: { ...mockEmptyAnalysis.averageStats, speed: 60 } // Low severity
    };
    const recommendations = generateRecommendations(analysis, 6);

    expect(recommendations[0].severity).toBe("high");
    expect(recommendations[recommendations.length - 1].severity).toBe("low");
  });

  it("deduplicates recommendations", () => {
      // Manually calling generate would usually prevent this, but testing deduplication logic
      const analysis = { ...mockEmptyAnalysis };
      const recommendations = generateRecommendations(analysis, 3);
      const ids = recommendations.map(r => r.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
  });
});
