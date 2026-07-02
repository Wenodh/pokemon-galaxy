import { TeamAnalysis } from "@/features/team-analysis/types/analysis.types";
import { Recommendation, RecommendationCategory } from "@/features/team-recommendations/types/recommendation.types";
import { SuggestionCandidate } from "../types/suggestion.types";
import { SCORING_WEIGHTS } from "../constants/suggestion-rules";

export interface ScoringResult {
  score: number;
  reasons: string[];
  addresses: RecommendationCategory[];
}

export function scoreCandidate(
  candidate: SuggestionCandidate,
  analysis: TeamAnalysis,
  recommendations: Recommendation[]
): ScoringResult {
  let score = 0;
  const reasons: string[] = [];
  const addresses: RecommendationCategory[] = [];

  // 1. Addresses active recommendations (Weight: 30)
  recommendations.forEach(rec => {
    let addressed = false;
    let reason = "";

    if (rec.id.startsWith("weakness-")) {
      const weakType = rec.id.replace("weakness-", "");
      if (isResistantTo(candidate, weakType)) {
        addressed = true;
        reason = `Resists ${weakType}, addressing your defensive weakness.`;
      }
    } else if (rec.id.startsWith("missing-coverage-")) {
      const gapType = rec.id.replace("missing-coverage-", "");
      if (gapType === "major") {
        // Any offensive powerhouse helps major gaps
        if (candidate.roles.some(r => r.includes("Sweeper"))) {
          addressed = true;
          reason = `Strong offensive presence helps fill major coverage gaps.`;
        }
      } else if (candidate.primaryType === gapType || candidate.secondaryType === gapType) {
        addressed = true;
        reason = `Provides ${gapType} offensive coverage.`;
      }
    } else if (rec.id.startsWith("missing-")) {
      let isMatch = false;
      let roleName = "";

      if (rec.id === "missing-physical-attacker") {
        isMatch = candidate.roles.some(r => r === "Physical Sweeper" || r === "Mixed Sweeper");
        roleName = "Physical Attacker";
      } else if (rec.id === "missing-special-attacker") {
        isMatch = candidate.roles.some(r => r === "Special Sweeper" || r === "Mixed Sweeper");
        roleName = "Special Attacker";
      } else if (rec.id === "missing-tank") {
        isMatch = candidate.roles.some(r => r === "Tank" || r.includes("Wall"));
        roleName = "Tank or Wall";
      }

      if (isMatch) {
        addressed = true;
        reason = `Fills the missing ${roleName} role.`;
      }
    } else if (rec.id === "low-speed") {
      if (candidate.speedTier === "fast" || candidate.speedTier === "very-fast") {
        addressed = true;
        reason = `Provides much-needed speed to the team.`;
      }
    } else if (rec.id === "low-bulk") {
      if (candidate.bulkTier === "high" || candidate.bulkTier === "extreme") {
        addressed = true;
        reason = `Adds durability to your relatively fragile team.`;
      }
    } else if (rec.id === "empty-slots" || rec.id === "empty-team") {
      if (candidate.tags.includes("beginner-friendly") || candidate.tags.includes("versatile")) {
        addressed = true;
        reason = `A versatile, beginner-friendly choice for your team.`;
      }
    }

    if (addressed) {
      score += SCORING_WEIGHTS.ADDRESSES_RECOMMENDATION;
      reasons.push(reason);
      if (!addresses.includes(rec.category)) {
        addresses.push(rec.category);
      }
    }
  });

  // 2. Improves offensive coverage (Weight: 20)
  const providesNewCoverage = analysis.missingTypes.some(type =>
    candidate.primaryType === type || candidate.secondaryType === type
  );
  if (providesNewCoverage) {
    score += SCORING_WEIGHTS.IMPROVES_OFFENSIVE_COVERAGE;
    reasons.push(`Provides offensive coverage for types you currently lack.`);
  }

  // 3. Improves defensive coverage (Weight: 20)
  // Reward candidates that resist types the team is weak to, even if not a "high" priority recommendation
  const teamWeaknesses = analysis.weaknesses.map(w => w.type);
  const resistsWeakness = teamWeaknesses.some(w => isResistantTo(candidate, w));
  if (resistsWeakness) {
    score += SCORING_WEIGHTS.IMPROVES_DEFENSIVE_COVERAGE;
    reasons.push(`Has useful resistances that complement your team's weaknesses.`);
  }

  // 4. Adds missing role (Weight: 15)
  const currentRoles = new Set(Object.values(analysis.pokemonRoles));
  const addsNewRole = candidate.roles.some(role => !currentRoles.has(role));
  if (addsNewRole) {
    score += SCORING_WEIGHTS.ADDS_MISSING_ROLE;
    reasons.push(`Brings a new role (${candidate.roles.find(r => !currentRoles.has(r))}) to the team.`);
  }

  // 5. Improves team diversity (Weight: 10)
  const isDuplicateType = analysis.typeDistribution.some(td =>
    td.type === candidate.primaryType || td.type === candidate.secondaryType
  );
  if (!isDuplicateType) {
    score += SCORING_WEIGHTS.IMPROVES_DIVERSITY;
    reasons.push(`Adds new types to your team, increasing diversity.`);
  }

  // 6. General synergy (Weight: 5)
  if (candidate.tags.includes("synergistic") || candidate.tags.includes("competitive-staple")) {
    score += SCORING_WEIGHTS.GENERAL_SYNERGY;
    reasons.push(`Highly synergistic and a staple in many competitive teams.`);
  }

  // Normalize score to 0-100 (or higher if it's really good, we can cap it later)
  // Given weights: 30 + 20 + 20 + 15 + 10 + 5 = 100 max per "category"
  // But a candidate can address MULTIPLE recommendations.
  // We'll let it grow and handle confidence thresholds.

  return {
    score,
    reasons: Array.from(new Set(reasons)), // Deduplicate reasons
    addresses
  };
}

/**
 * Helper for basic type resistance check.
 * Checks if the candidate resists or is immune to a specific attack type.
 */
function isResistantTo(candidate: SuggestionCandidate, attackType: string): boolean {
  const defenderTypes = [candidate.primaryType, candidate.secondaryType].filter(Boolean) as string[];

  // defenderType: [attackTypesItResists]
  const resistances: Record<string, string[]> = {
    normal: [],
    fire: ["fire", "grass", "ice", "bug", "steel", "fairy"],
    water: ["fire", "water", "ice", "steel"],
    grass: ["water", "electric", "grass", "ground"],
    electric: ["electric", "flying", "steel"],
    ice: ["ice"],
    fighting: ["bug", "rock", "dark"],
    poison: ["grass", "fighting", "poison", "bug", "fairy"],
    ground: ["poison", "rock"],
    flying: ["grass", "fighting", "bug"],
    psychic: ["fighting", "psychic"],
    bug: ["grass", "fighting", "ground"],
    rock: ["normal", "fire", "poison", "flying"],
    ghost: ["poison", "bug"],
    dragon: ["fire", "water", "electric", "grass"],
    dark: ["ghost", "dark"],
    steel: ["normal", "grass", "ice", "flying", "psychic", "bug", "rock", "dragon", "steel", "fairy"],
    fairy: ["fighting", "bug", "dark"]
  };

  // defenderType: [attackTypesItIsImmuneTo]
  const immunities: Record<string, string[]> = {
    normal: ["ghost"],
    fire: [],
    water: [],
    grass: [],
    electric: [],
    ice: [],
    fighting: [],
    poison: [],
    ground: ["electric"],
    flying: ["ground"],
    psychic: [],
    bug: [],
    rock: [],
    ghost: ["normal", "fighting"],
    dragon: [],
    dark: ["psychic"],
    steel: ["poison"],
    fairy: ["dragon"]
  };

  return defenderTypes.some(t =>
    (resistances[t] || []).includes(attackType) ||
    (immunities[t] || []).includes(attackType)
  );
}
