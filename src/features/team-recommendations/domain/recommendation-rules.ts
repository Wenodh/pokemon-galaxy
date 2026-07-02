import { TeamAnalysis } from "@/features/team-analysis/types/analysis.types";
import { Recommendation, RecommendationCategory } from "../types/recommendation.types";
import { BULK_THRESHOLD, SPEED_THRESHOLD } from "../constants/recommendation-rules";

export const createRecommendation = (
  id: string,
  category: RecommendationCategory,
  severity: "low" | "medium" | "high",
  title: string,
  description: string,
  suggestedAction: string,
  source: Recommendation["source"]
): Recommendation => ({
  id,
  category,
  severity,
  title,
  description,
  suggestedAction,
  source,
});

export const getEmptyTeamRecommendation = (): Recommendation =>
  createRecommendation(
    "empty-team",
    "Empty Team",
    "high",
    "Your team is empty",
    "Add Pokémon to begin building and analyzing a team.",
    "Add Pokémon to your team.",
    "teamSize"
  );

export const getEmptySlotsRecommendation = (count: number): Recommendation | null => {
  if (count <= 0 || count >= 6) return null;
  return createRecommendation(
    "empty-slots",
    "Empty Slots",
    "medium",
    "Empty slots available",
    `Your team has only ${count} Pokémon. Consider filling the remaining slots.`,
    "Add more Pokémon to complete your team.",
    "teamSize"
  );
};

export const getMissingRoleRecommendations = (roles: Record<string, string>): Recommendation[] => {
  const recommendations: Recommendation[] = [];
  const activeRoles = new Set(Object.values(roles));

  if (!activeRoles.has("Physical Sweeper") && !activeRoles.has("Mixed Sweeper")) {
    recommendations.push(createRecommendation(
      "missing-physical-attacker",
      "Missing Roles",
      "medium",
      "No Physical Attacker",
      "Your team lacks a strong physical presence.",
      "Consider adding a physical attacker.",
      "pokemonRoles"
    ));
  }

  if (!activeRoles.has("Special Sweeper") && !activeRoles.has("Mixed Sweeper")) {
    recommendations.push(createRecommendation(
      "missing-special-attacker",
      "Missing Roles",
      "medium",
      "No Special Attacker",
      "Your team lacks a strong special presence.",
      "Consider adding a special attacker.",
      "pokemonRoles"
    ));
  }

  if (!activeRoles.has("Tank") && !activeRoles.has("Physical Wall") && !activeRoles.has("Special Wall") && !activeRoles.has("Mixed Wall")) {
    recommendations.push(createRecommendation(
      "missing-tank",
      "Missing Roles",
      "medium",
      "No Tank or Wall",
      "Your team lacks a durable defensive Pokémon.",
      "Consider adding a tank or defensive wall.",
      "pokemonRoles"
    ));
  }

  return recommendations;
};

export const getLowBulkRecommendation = (stats: TeamAnalysis["averageStats"]): Recommendation | null => {
  const bulk = stats.hp + stats.defense + stats.specialDefense;
  if (bulk < BULK_THRESHOLD) {
    return createRecommendation(
      "low-bulk",
      "Low Bulk",
      "low",
      "Low Team Bulk",
      "Most of your team members have low defensive stats.",
      "Consider adding more durable Pokémon.",
      "averageStats"
    );
  }
  return null;
};

export const getLowSpeedRecommendation = (stats: TeamAnalysis["averageStats"]): Recommendation | null => {
  if (stats.speed < SPEED_THRESHOLD) {
    return createRecommendation(
      "low-speed",
      "Low Speed",
      "low",
      "Low Team Speed",
      "Most of your team is slower than average.",
      "Add a faster Pokémon to provide speed control.",
      "averageStats"
    );
  }
  return null;
};

export const getWeaknessRecommendations = (weaknesses: TeamAnalysis["weaknesses"]): Recommendation[] => {
  return weaknesses
    .filter(w => w.count >= 3)
    .map(w => createRecommendation(
      `weakness-${w.type}`,
      "Defensive Weaknesses",
      w.count >= 4 ? "high" : "medium",
      `${w.type.charAt(0).toUpperCase() + w.type.slice(1)} Weakness`,
      `Multiple team members (${w.count}) are weak to ${w.type}-type attacks.`,
      `Add a Pokémon that resists ${w.type}.`,
      "defensiveMetrics"
    ));
};

export const getDuplicateTypeRecommendations = (duplicates: TeamAnalysis["duplicateTypes"]): Recommendation[] => {
  return duplicates
    .filter(d => d.count >= 3)
    .map(d => createRecommendation(
      `duplicate-${d.type}`,
      "Duplicate Types",
      d.count >= 4 ? "high" : "medium",
      `Too many ${d.type.charAt(0).toUpperCase() + d.type.slice(1)} types`,
      `${d.count} ${d.type}-type Pokémon increase your shared weaknesses.`,
      `Reduce the number of ${d.type}-type Pokémon.`,
      "warnings"
    ));
};

export const getOffensiveGapRecommendations = (missingTypes: string[]): Recommendation[] => {
  // If many types are missing, just give one general recommendation
  if (missingTypes.length > 5) {
    return [createRecommendation(
      "offensive-gaps-major",
      "Offensive Gaps",
      "medium",
      "Major Offensive Gaps",
      "Your team lacks super-effective coverage for many types.",
      "Add Pokémon with diverse move types.",
      "offensiveCoverage"
    )];
  }

  // Otherwise list specific important missing coverages (just a few)
  return missingTypes.slice(0, 3).map(type => createRecommendation(
    `missing-coverage-${type}`,
    "Offensive Gaps",
    "low",
    `Missing ${type.charAt(0).toUpperCase() + type.slice(1)} Coverage`,
    `Your team lacks reliable ${type}-type offense.`,
    `Consider adding a ${type}-type attacker.`,
    "offensiveCoverage"
  ));
};

export const getTeamBalanceRecommendation = (balanceScore: number): Recommendation | null => {
  if (balanceScore < 10) { // SCORE_WEIGHTS.TEAM_BALANCE is 20
    return createRecommendation(
      "team-balance",
      "Team Balance",
      "low",
      "Improve Team Balance",
      "Your team composition could be more balanced.",
      "Consider diversifying your team roles and types.",
      "scoreBreakdown"
    );
  }
  return null;
};
