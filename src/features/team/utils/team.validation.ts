import { Team, Result, PokemonId } from "../types/team.types";
import { MAX_TEAM_SIZE } from "../constants/team.constants";

export const validateTeamName = (
  name: string,
  existingTeams: Team[],
  excludeId?: string
): Result<string> => {
  const trimmedName = name.trim();

  if (trimmedName.length === 0) {
    return { ok: false, error: "EMPTY_NAME" };
  }

  const isDuplicate = existingTeams.some(
    (team) =>
      team.name.toLowerCase() === trimmedName.toLowerCase() &&
      team.id !== excludeId
  );

  if (isDuplicate) {
    return { ok: false, error: "DUPLICATE_NAME" };
  }

  return { ok: true, value: trimmedName };
};

export const validateAddPokemon = (
  team: Team,
  pokemonId: PokemonId
): Result => {
  if (team.pokemon.length >= MAX_TEAM_SIZE) {
    return { ok: false, error: "TEAM_FULL" };
  }

  if (team.pokemon.includes(pokemonId)) {
    return { ok: false, error: "DUPLICATE_POKEMON" };
  }

  return { ok: true, value: undefined };
};

export const generateUniqueCopyName = (
  originalName: string,
  existingTeams: Team[]
): string => {
  const baseName = `${originalName} Copy`;
  let candidateName = baseName;
  let counter = 2;

  const names = new Set(existingTeams.map(t => t.name.toLowerCase()));

  while (names.has(candidateName.toLowerCase())) {
    candidateName = `${baseName} ${counter}`;
    counter++;
  }

  return candidateName;
};
