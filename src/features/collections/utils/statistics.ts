import { legendaryIds, mythicalIds, ultraBeastIds, paradoxIds, GENERATIONS } from "../constants";

export interface CollectionStats {
  totalCount: number;
  typeDistribution: Record<string, number>;
  generationDistribution: Record<string, number>;
  averageBST: number;
  legendaryCount: number;
  mythicalCount: number;
  ultraBeastCount: number;
  paradoxCount: number;
}

export function calculateCollectionStats(pokemonList: any[]): CollectionStats {
  const totalCount = pokemonList.length;

  const typeDistribution: Record<string, number> = {};
  const generationDistribution: Record<string, number> = {};
  let totalBST = 0;
  let bstCount = 0;
  let legendaryCount = 0;
  let mythicalCount = 0;
  let ultraBeastCount = 0;
  let paradoxCount = 0;

  pokemonList.forEach((pokemon) => {
    if (!pokemon) return;

    // Type Distribution (Primary + Secondary types)
    const types: string[] = pokemon.types || [];
    types.forEach((t) => {
      const typeLower = t.toLowerCase();
      typeDistribution[typeLower] = (typeDistribution[typeLower] || 0) + 1;
    });

    // Generation Distribution
    const gen = GENERATIONS.find((g) => pokemon.id >= g.startId && pokemon.id <= g.endId);
    if (gen) {
      generationDistribution[gen.name] = (generationDistribution[gen.name] || 0) + 1;
    } else {
      generationDistribution["Unknown"] = (generationDistribution["Unknown"] || 0) + 1;
    }

    // Average BST
    let bst = 0;
    if (Array.isArray(pokemon.stats)) {
      bst = pokemon.stats.reduce((sum: number, s: any) => sum + (s.value || 0), 0);
    }
    if (bst > 0) {
      totalBST += bst;
      bstCount += 1;
    }

    // Legendary, Mythical, Ultra Beast, Paradox checks
    if (legendaryIds.has(pokemon.id)) legendaryCount++;
    if (mythicalIds.has(pokemon.id)) mythicalCount++;
    if (ultraBeastIds.has(pokemon.id)) ultraBeastCount++;
    if (paradoxIds.has(pokemon.id)) paradoxCount++;
  });

  return {
    totalCount,
    typeDistribution,
    generationDistribution,
    averageBST: bstCount > 0 ? Math.round(totalBST / bstCount) : 0,
    legendaryCount,
    mythicalCount,
    ultraBeastCount,
    paradoxCount,
  };
}

export interface ProgressStats {
  seen: number;
  caught: number;
  total: number;
  percentage: number;
}

export function calculateProgressStats(
  entries: Record<number, { seen: boolean; caught: boolean }>,
  pokemonIds: number[]
): ProgressStats {
  const total = pokemonIds.length;
  let seen = 0;
  let caught = 0;

  pokemonIds.forEach((id) => {
    const entry = entries[id];
    if (entry) {
      if (entry.seen) seen++;
      if (entry.caught) caught++;
    }
  });

  return {
    seen,
    caught,
    total,
    percentage: total > 0 ? Math.round((caught / total) * 100) : 0,
  };
}
