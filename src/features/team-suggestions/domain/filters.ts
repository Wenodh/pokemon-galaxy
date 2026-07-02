import { SuggestionCandidate } from "../types/suggestion.types";

export function filterCandidates(
  candidates: SuggestionCandidate[],
  teamPokemonIds: number[]
): SuggestionCandidate[] {
  const teamIdsSet = new Set(teamPokemonIds);

  return candidates.filter(candidate => {
    // Never suggest Pokémon already on the team
    if (teamIdsSet.has(candidate.pokemonId)) {
      return false;
    }

    // We can add more filters here if needed (e.g. unique species check if candidate list had multiple forms)

    return true;
  });
}
