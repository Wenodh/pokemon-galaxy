export type PokemonRole =
  | "Physical Sweeper"
  | "Special Sweeper"
  | "Mixed Sweeper"
  | "Physical Wall"
  | "Special Wall"
  | "Mixed Wall"
  | "Tank"
  | "Fast Attacker"
  | "Support"
  | "Balanced";

export type WarningSeverity = "low" | "medium" | "high";

export interface AnalysisWarning {
  type: string;
  message: string;
  severity: WarningSeverity;
  affectedTypes?: string[];
}

export interface TypeCount {
  type: string;
  count: number;
}

export interface OffensiveCoverage {
  type: string;
  effectiveness: number; // How many team members have a move of this type? (Heuristic for now)
  coveredBy: string[]; // Names of Pokemon providing this coverage
}

export interface DefensiveRating {
  type: string;
  multiplier: number; // Cumulative or average effectiveness against the team
  count: number; // Number of Pokemon with this vulnerability/resistance
}

export interface TeamStats {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
  bst: number;
}

export interface ScoreBreakdown {
  offensiveCoverage: number;
  defensiveCoverage: number;
  teamBalance: number;
  statDistribution: number;
}

export interface TeamAnalysis {
  offensiveCoverage: OffensiveCoverage[];
  weaknesses: DefensiveRating[];
  resistances: DefensiveRating[];
  immunities: DefensiveRating[];
  duplicateTypes: TypeCount[];
  missingTypes: string[];
  averageStats: TeamStats;
  highestStat: string;
  lowestStat: string;
  pokemonRoles: Record<string, PokemonRole>; // Mapping of Pokemon Name -> Role
  warnings: AnalysisWarning[];
  overallScore: number;
  scoreBreakdown: ScoreBreakdown;
}
