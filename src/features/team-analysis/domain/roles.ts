import { PokemonDetails } from "@/features/pokemon/types";
import { PokemonRole } from "../types/analysis.types";

export function detectRole(pokemon: PokemonDetails): PokemonRole {
  const stats: Record<string, number> = {};
  pokemon.stats.forEach((s) => {
    stats[s.name.toLowerCase()] = s.value;
  });

  const hp = stats["hp"] || 0;
  const atk = stats["attack"] || 0;
  const def = stats["defense"] || 0;
  const spa = stats["special-attack"] || 0;
  const spd = stats["special-defense"] || 0;
  const spe = stats["speed"] || 0;

  // Thresholds for heuristics
  const HIGH_STAT = 100;
  const FAST_SPE = 90;

  // Sweeper detection
  if (spe >= FAST_SPE) {
    if (atk >= HIGH_STAT && spa >= HIGH_STAT) return "Mixed Sweeper";
    if (atk >= HIGH_STAT) return "Physical Sweeper";
    if (spa >= HIGH_STAT) return "Special Sweeper";
    return "Fast Attacker";
  }

  // Wall detection
  if (hp >= 80) {
    if (def >= HIGH_STAT && spd >= HIGH_STAT) return "Mixed Wall";
    if (def >= HIGH_STAT) return "Physical Wall";
    if (spd >= HIGH_STAT) return "Special Wall";
  }

  // Tank detection
  if (hp >= 80 && (atk >= 90 || spa >= 90)) return "Tank";

  // Support/Balanced
  if (Math.abs(atk - spa) < 20 && Math.abs(def - spd) < 20) return "Balanced";

  return "Support";
}

export function detectTeamRoles(team: PokemonDetails[]): Record<string, PokemonRole> {
  const roles: Record<string, PokemonRole> = {};
  team.forEach((pokemon) => {
    roles[pokemon.name] = detectRole(pokemon);
  });
  return roles;
}
