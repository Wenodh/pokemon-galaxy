export type PokemonId = number;

export interface Team {
  id: string;
  name: string;
  pokemon: PokemonId[];
  createdAt: number;
  updatedAt: number;
  notes?: string;
  tags?: string[];
}

export type TeamError =
  | "EMPTY_NAME"
  | "DUPLICATE_NAME"
  | "TEAM_FULL"
  | "DUPLICATE_POKEMON"
  | "TEAM_NOT_FOUND"
  | "POKEMON_NOT_IN_TEAM";

export type Result<T = void> =
  | { ok: true; value: T }
  | { ok: false; error: TeamError };

export interface TeamState {
  teams: Record<string, Team>;
  teamOrder: string[];
  activeTeamId: string | null;
  version: number;
}

export interface TeamActions {
  createTeam: (name: string) => Result<string>;
  deleteTeam: (id: string) => void;
  renameTeam: (id: string, newName: string) => Result;
  duplicateTeam: (id: string) => Result<string>;
  addPokemon: (teamId: string, pokemonId: PokemonId) => Result;
  removePokemon: (teamId: string, pokemonId: PokemonId) => Result;
  movePokemon: (teamId: string, fromIndex: number, toIndex: number) => Result;
  clearTeam: (teamId: string) => Result;
  setActiveTeam: (id: string | null) => void;
  getTeam: (id: string) => Team | undefined;
  getAllTeams: () => Team[];
}

export type TeamStore = TeamState & TeamActions;
