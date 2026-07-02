import { TeamAnalysis } from "@/features/team-analysis/types/analysis.types";
import { Recommendation } from "../types/recommendation.types";
import {
  getEmptyTeamRecommendation,
  getEmptySlotsRecommendation,
  getMissingRoleRecommendations,
  getLowBulkRecommendation,
  getLowSpeedRecommendation,
  getWeaknessRecommendations,
  getDuplicateTypeRecommendations,
  getOffensiveGapRecommendations,
  getTeamBalanceRecommendation
} from "./recommendation-rules";
import { rankRecommendations } from "./scoring";

export function generateRecommendations(
  analysis: TeamAnalysis,
  teamSize: number
): Recommendation[] {
  // Special case: Empty Team
  if (teamSize === 0) {
    return [getEmptyTeamRecommendation()];
  }

  const recommendations: Recommendation[] = [];

  // 1. Empty Slots
  const emptySlots = getEmptySlotsRecommendation(teamSize);
  if (emptySlots) recommendations.push(emptySlots);

  // 2. Missing Roles
  recommendations.push(...getMissingRoleRecommendations(analysis.pokemonRoles));

  // 3. Defensive Weaknesses
  recommendations.push(...getWeaknessRecommendations(analysis.weaknesses));

  // 4. Duplicate Types
  recommendations.push(...getDuplicateTypeRecommendations(analysis.duplicateTypes));

  // 5. Offensive Gaps
  recommendations.push(...getOffensiveGapRecommendations(analysis.missingTypes));

  // 6. Low Speed
  const lowSpeed = getLowSpeedRecommendation(analysis.averageStats);
  if (lowSpeed) recommendations.push(lowSpeed);

  // 7. Low Bulk
  const lowBulk = getLowBulkRecommendation(analysis.averageStats);
  if (lowBulk) recommendations.push(lowBulk);

  // 8. Team Balance
  const balance = getTeamBalanceRecommendation(analysis.scoreBreakdown.teamBalance);
  if (balance) recommendations.push(balance);

  // Deduplicate and Rank
  return rankRecommendations(deduplicateRecommendations(recommendations));
}

function deduplicateRecommendations(recommendations: Recommendation[]): Recommendation[] {
    const seen = new Set<string>();
    return recommendations.filter(rec => {
        const key = `${rec.category}-${rec.title}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}
