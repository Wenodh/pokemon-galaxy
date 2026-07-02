import { PokemonRole } from "@/features/team-analysis/types/analysis.types";
import { RecommendationCategory } from "@/features/team-recommendations/types/recommendation.types";

export type SuggestionTag =
  | "versatile"
  | "beginner-friendly"
  | "competitive-staple"
  | "synergistic"
  | "offensive-threat"
  | "defensive-backbone"
  | "hazard-setter"
  | "hazard-remover"
  | "pivot"
  | "priority-user"
  | "cleric"
  | "weather-setter"
  | "terrain-setter";

export type SpeedTier = "very-slow" | "slow" | "average" | "fast" | "very-fast";
export type BulkTier = "low" | "medium" | "high" | "extreme";

export interface SuggestionCandidate {
  pokemonId: number;
  name: string;
  roles: PokemonRole[];
  primaryType: string;
  secondaryType?: string;
  speedTier: SpeedTier;
  bulkTier: BulkTier;
  tags: SuggestionTag[];
  generation: number;
}

export type Confidence = "Low" | "Medium" | "High";

export interface PokemonSuggestion {
  pokemonId: number;
  pokemonName: string;
  score: number;
  reasons: string[];
  addresses: RecommendationCategory[];
  confidence: Confidence;
}
