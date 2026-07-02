import { Team } from "@/features/team/types/team.types";
import { TeamAnalysis } from "@/features/team-analysis/types/analysis.types";
import { Recommendation } from "@/features/team-recommendations/types/recommendation.types";
import { PokemonSuggestion } from "../types/suggestion.types";
import { CANDIDATE_DATASET } from "../constants/suggestion-rules";
import { filterCandidates } from "./filters";
import { scoreCandidate } from "./scoring";
import { rankSuggestions, calculateConfidence } from "./ranking";

/**
 * Smart Pokémon Suggestion Engine
 *
 * Recommends Pokémon to improve the current team based on analysis and recommendations.
 * Pure and deterministic.
 */
export function getSuggestions(
  team: Team,
  analysis: TeamAnalysis,
  recommendations: Recommendation[]
): PokemonSuggestion[] {
  // 1. Filter candidates (exclude existing team members)
  const filteredCandidates = filterCandidates(CANDIDATE_DATASET, team.pokemon);

  // 2. Score candidates
  const suggestions: PokemonSuggestion[] = filteredCandidates.map(candidate => {
    const { score, reasons, addresses } = scoreCandidate(candidate, analysis, recommendations);

    return {
      pokemonId: candidate.pokemonId,
      pokemonName: candidate.name,
      score,
      reasons,
      addresses,
      confidence: calculateConfidence(score)
    };
  });

  // 3. Rank and return top suggestions
  return rankSuggestions(suggestions);
}
