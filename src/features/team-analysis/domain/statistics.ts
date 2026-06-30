import { PokemonDetails } from "@/features/pokemon/types";
import { TeamStats } from "../types/analysis.types";

export function calculateAverageStats(team: PokemonDetails[]): TeamStats {
  if (team.length === 0) {
    return {
      hp: 0,
      attack: 0,
      defense: 0,
      specialAttack: 0,
      specialDefense: 0,
      speed: 0,
      bst: 0,
    };
  }

  const totals = team.reduce(
    (acc, pokemon) => {
      pokemon.stats.forEach((stat) => {
        const name = stat.name.toLowerCase();
        if (name === "hp") acc.hp += stat.value;
        else if (name === "attack") acc.attack += stat.value;
        else if (name === "defense") acc.defense += stat.value;
        else if (name === "special-attack") acc.specialAttack += stat.value;
        else if (name === "special-defense") acc.specialDefense += stat.value;
        else if (name === "speed") acc.speed += stat.value;
      });
      return acc;
    },
    { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 }
  );

  const count = team.length;
  const averageStats = {
    hp: Math.round(totals.hp / count),
    attack: Math.round(totals.attack / count),
    defense: Math.round(totals.defense / count),
    specialAttack: Math.round(totals.specialAttack / count),
    specialDefense: Math.round(totals.specialDefense / count),
    speed: Math.round(totals.speed / count),
  };

  const bst = Object.values(averageStats).reduce((a, b) => a + b, 0);

  return { ...averageStats, bst };
}
