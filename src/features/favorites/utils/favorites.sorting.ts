import { PokemonListItem } from "@/features/pokedex/types";

export type SortOption = "number-asc" | "number-desc" | "name-asc" | "name-desc";

/**
 * Filters Pokémon list by name or ID.
 */
export function filterPokemon(pokemon: PokemonListItem[], query: string): PokemonListItem[] {
  if (!query) return pokemon;

  const searchLower = query.toLowerCase();
  return pokemon.filter((p) => {
    const matchesName = p.name.toLowerCase().includes(searchLower);
    const matchesId = p.id.toString().includes(query);
    return matchesName || matchesId;
  });
}

/**
 * Sorts Pokémon list based on the selected option.
 */
export function sortPokemon(pokemon: PokemonListItem[], sortBy: SortOption): PokemonListItem[] {
  return [...pokemon].sort((a, b) => {
    switch (sortBy) {
      case "number-asc":
        return a.id - b.id;
      case "number-desc":
        return b.id - a.id;
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });
}
