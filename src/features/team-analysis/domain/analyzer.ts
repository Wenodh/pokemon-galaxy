import { PokemonDetails } from "@/features/pokemon/types";
import { TeamAnalysis, AnalysisWarning, TypeCount, ScoreBreakdown } from "../types/analysis.types";
import { calculateAverageStats } from "./statistics";
import { detectTeamRoles } from "./roles";
import { calculateTeamDefensiveMetrics } from "./defensive";
import { calculateOffensiveCoverage } from "./coverage";
import { SCORE_WEIGHTS, TOTAL_TYPES } from "../constants/analysis.constants";

/**
 * Calculates a heuristic score for the team based on multiple factors.
 *
 * Weights:
 * - Offensive Coverage (35%): Based on the number of types the team can hit super-effectively.
 * - Defensive Coverage (35%): Penalizes stacked weaknesses (3+ Pokémon) and rewards immunities/resistances.
 * - Team Balance (20%): Penalizes high duplicate type counts and rewards role diversity.
 * - Stat Distribution (10%): Based on average Base Stat Total (BST) and Speed.
 */
function calculateScore(
  team: PokemonDetails[],
  analysis: Pick<TeamAnalysis, "offensiveCoverage" | "weaknesses" | "immunities" | "resistances" | "duplicateTypes" | "pokemonRoles" | "averageStats">
): { overallScore: number; scoreBreakdown: ScoreBreakdown } {
  if (team.length === 0) {
    return {
      overallScore: 0,
      scoreBreakdown: { offensiveCoverage: 0, defensiveCoverage: 0, teamBalance: 0, statDistribution: 0 }
    };
  }

  // 1. Offensive Coverage (35%)
  const coveredTypes = analysis.offensiveCoverage.filter(c => c.effectiveness > 0).length;
  const offensiveCoverageScore = (coveredTypes / TOTAL_TYPES) * SCORE_WEIGHTS.OFFENSIVE_COVERAGE;

  // 2. Defensive Coverage (35%)
  const severeWeaknesses = analysis.weaknesses.filter(w => w.count >= 3).length;
  const immunitiesCount = analysis.immunities.length;
  const resistancesCount = analysis.resistances.length;

  let defensiveCoverageScore = (SCORE_WEIGHTS.DEFENSIVE_COVERAGE * 0.7); // Base 70% of the weight
  defensiveCoverageScore -= severeWeaknesses * 5;
  defensiveCoverageScore += immunitiesCount * 2;
  defensiveCoverageScore += resistancesCount * 0.2;
  defensiveCoverageScore = Math.max(0, Math.min(defensiveCoverageScore, SCORE_WEIGHTS.DEFENSIVE_COVERAGE));

  // 3. Team Balance (20%)
  const duplicateTypesPenalty = analysis.duplicateTypes.filter(dt => dt.count >= 3).length;
  const uniqueRoles = new Set(Object.values(analysis.pokemonRoles)).size;

  let teamBalanceScore = 10; // Base balance
  teamBalanceScore -= duplicateTypesPenalty * 5;
  teamBalanceScore += (uniqueRoles / team.length) * 10;
  teamBalanceScore = Math.max(0, Math.min(teamBalanceScore, SCORE_WEIGHTS.TEAM_BALANCE));

  // 4. Stat Distribution (10%)
  const bstComponent = Math.min(analysis.averageStats.bst / 550, 1) * 5;
  const speedComponent = Math.min(analysis.averageStats.speed / 100, 1) * 5;
  const statDistributionScore = bstComponent + speedComponent;

  const totalRaw = offensiveCoverageScore + defensiveCoverageScore + teamBalanceScore + statDistributionScore;
  const overallScore = Math.round(totalRaw);

  return {
    overallScore: Math.min(overallScore, 100),
    scoreBreakdown: {
      offensiveCoverage: Math.round(offensiveCoverageScore),
      defensiveCoverage: Math.round(defensiveCoverageScore),
      teamBalance: Math.round(teamBalanceScore),
      statDistribution: Math.round(statDistributionScore),
    }
  };
}

export function analyzeTeam(team: PokemonDetails[]): TeamAnalysis {
  const averageStats = calculateAverageStats(team);
  const pokemonRoles = detectTeamRoles(team);
  const { weaknesses, resistances, immunities } = calculateTeamDefensiveMetrics(team);
  const offensiveCoverage = calculateOffensiveCoverage(team);

  // Duplicate Type Detection
  const typeCounts: Record<string, number> = {};
  team.forEach((p) => {
    p.types.forEach((t) => {
      const type = t.toLowerCase();
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });
  });

  const duplicateTypes: TypeCount[] = Object.entries(typeCounts)
    .filter(([_, count]) => count > 1)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);

  // Missing Coverage (Types with zero effectiveness)
  const missingTypes = offensiveCoverage
    .filter((c) => c.effectiveness === 0)
    .map((c) => c.type);

  // Heuristic for Highest/Lowest Stat
  const statEntries = Object.entries(averageStats).filter(([k]) => k !== "bst");
  statEntries.sort((a, b) => b[1] - a[1]);
  const highestStat = statEntries[0]?.[0] || "N/A";
  const lowestStat = statEntries[statEntries.length - 1]?.[0] || "N/A";

  // Generate Warnings
  const warnings: AnalysisWarning[] = [];

  duplicateTypes.forEach((dt) => {
    if (dt.count >= 3) {
      warnings.push({
        type: "DUPLICATE_TYPE",
        message: `Too many ${dt.type} types (${dt.count}). Your team lacks diversity.`,
        severity: dt.count >= 4 ? "high" : "medium",
        affectedTypes: [dt.type],
      });
    }
  });

  weaknesses.forEach((w) => {
    if (w.count >= 3) {
      warnings.push({
        type: "TEAM_WEAKNESS",
        message: `Very weak against ${w.type} types. ${w.count} Pokémon share this weakness.`,
        severity: w.count >= 4 ? "high" : "medium",
        affectedTypes: [w.type],
      });
    }
  });

  if (missingTypes.length > 5 && team.length > 0) {
    warnings.push({
      type: "OFFENSIVE_GAP",
      message: "Major offensive gaps detected. You lack super-effective coverage for many types.",
      severity: "medium",
    });
  }

  if (averageStats.speed < 70 && team.length > 0) {
    warnings.push({
      type: "LOW_SPEED",
      message: "Your team is quite slow on average.",
      severity: "low",
    });
  }

  // Check for Ground immunity (Common competitive requirement)
  const hasGroundImmunity = immunities.some(i => i.type === "ground");
  if (!hasGroundImmunity && team.length >= 3) {
      warnings.push({
          type: "NO_GROUND_IMMUNITY",
          message: "No Ground immunity detected. Consider adding a Flying type or Levitate user.",
          severity: "medium"
      });
  }

  const { overallScore, scoreBreakdown } = calculateScore(team, {
    offensiveCoverage,
    weaknesses,
    immunities,
    resistances,
    duplicateTypes,
    pokemonRoles,
    averageStats,
  });

  return {
    offensiveCoverage,
    weaknesses,
    resistances,
    immunities,
    duplicateTypes,
    missingTypes,
    averageStats,
    highestStat,
    lowestStat,
    pokemonRoles,
    warnings,
    overallScore,
    scoreBreakdown,
  };
}
