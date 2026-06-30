import { PokemonDetails } from "@/features/pokemon/types";
import { TeamAnalysis, AnalysisWarning, TypeCount } from "../types/analysis.types";
import { calculateAverageStats } from "./statistics";
import { detectTeamRoles } from "./roles";
import { calculateTeamDefensiveMetrics } from "./defensive";
import { calculateOffensiveCoverage } from "./coverage";

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
  };
}
