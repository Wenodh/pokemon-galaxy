import { PokemonSuggestion } from "../types/suggestion.types";
import { CONFIDENCE_THRESHOLDS } from "../constants/suggestion-rules";

export function calculateConfidence(score: number): PokemonSuggestion["confidence"] {
  if (score >= CONFIDENCE_THRESHOLDS.HIGH) return "High";
  if (score >= CONFIDENCE_THRESHOLDS.MEDIUM) return "Medium";
  return "Low";
}

export function rankSuggestions(suggestions: PokemonSuggestion[]): PokemonSuggestion[] {
  return [...suggestions]
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      // If scores are tied, use ID as a tie-breaker for determinism
      return a.pokemonId - b.pokemonId;
    })
    .slice(0, 6); // Return top 6 suggestions
}
