import { PokemonRole } from "../types/analysis.types";

export const ROLE_DESCRIPTIONS: Record<PokemonRole, string> = {
  "Physical Sweeper": "Fast and hits hard with physical attacks.",
  "Special Sweeper": "Fast and hits hard with special attacks.",
  "Mixed Sweeper": "Versatile attacker capable of using both physical and special moves.",
  "Physical Wall": "Excellent at absorbing physical damage to protect the team.",
  "Special Wall": "Excellent at absorbing special damage to protect the team.",
  "Mixed Wall": "Defensive anchor capable of taking both physical and special hits.",
  "Tank": "Durable Pokémon that can take hits and dish them back out.",
  "Fast Attacker": "Relies on high speed to strike first and pressure opponents.",
  "Support": "Focuses on utility and assisting teammates rather than direct damage.",
  "Balanced": "Well-rounded stats with no specific specialization.",
};

export const SCORE_WEIGHTS = {
  OFFENSIVE_COVERAGE: 35,
  DEFENSIVE_COVERAGE: 35,
  TEAM_BALANCE: 20,
  STAT_DISTRIBUTION: 10,
};

export const SCORE_BANDS = [
  { min: 90, label: "Excellent", color: "text-green-500" },
  { min: 75, label: "Good", color: "text-blue-500" },
  { min: 60, label: "Fair", color: "text-yellow-500" },
  { min: 0, label: "Needs Improvement", color: "text-red-500" },
];

export const TOTAL_TYPES = 18;
