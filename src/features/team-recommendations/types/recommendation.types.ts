export type RecommendationSeverity = "low" | "medium" | "high";

export type RecommendationCategory =
  | "Type Coverage"
  | "Defensive Weaknesses"
  | "Offensive Gaps"
  | "Duplicate Types"
  | "Missing Roles"
  | "Low Speed"
  | "Low Bulk"
  | "Team Balance"
  | "Empty Slots"
  | "Empty Team";

export type RecommendationSource =
  | "warnings"
  | "averageStats"
  | "offensiveCoverage"
  | "defensiveMetrics"
  | "pokemonRoles"
  | "scoreBreakdown"
  | "teamSize";

export interface Recommendation {
  id: string;
  category: RecommendationCategory;
  severity: RecommendationSeverity;
  title: string;
  description: string;
  suggestedAction: string;
  source: RecommendationSource;
}
