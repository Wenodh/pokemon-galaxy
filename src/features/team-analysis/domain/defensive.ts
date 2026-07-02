import { PokemonDetails } from "@/features/pokemon/types";
import { calculateTypeEffectiveness } from "@/features/pokemon/utils/type-effectiveness";
import { DefensiveRating } from "../types/analysis.types";

export function calculateTeamDefensiveMetrics(team: PokemonDetails[]) {
  const weaknesses: Record<string, { multiplier: number; count: number }> = {};
  const resistances: Record<string, { multiplier: number; count: number }> = {};
  const immunities: Record<string, { multiplier: number; count: number }> = {};

  team.forEach((pokemon) => {
    const effectiveness = calculateTypeEffectiveness(pokemon.types);

    (effectiveness.weaknesses || []).forEach((w) => {
      if (!weaknesses[w.type]) weaknesses[w.type] = { multiplier: 1, count: 0 };
      weaknesses[w.type].multiplier *= w.multiplier;
      weaknesses[w.type].count++;
    });

    (effectiveness.resistances || []).forEach((r) => {
      if (!resistances[r.type]) resistances[r.type] = { multiplier: 1, count: 0 };
      resistances[r.type].multiplier *= r.multiplier;
      resistances[r.type].count++;
    });

    (effectiveness.immunities || []).forEach((i) => {
      if (!immunities[i.type]) immunities[i.type] = { multiplier: 0, count: 0 };
      immunities[i.type].count++;
    });
  });

  const format = (record: Record<string, { multiplier: number; count: number }>): DefensiveRating[] =>
    Object.entries(record).map(([type, data]) => ({
      type,
      multiplier: data.multiplier,
      count: data.count,
    }));

  return {
    weaknesses: format(weaknesses).sort((a, b) => b.count - a.count),
    resistances: format(resistances).sort((a, b) => b.count - a.count),
    immunities: format(immunities).sort((a, b) => b.count - a.count),
  };
}
