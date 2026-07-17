export type PokemonId = number;

export type Gender = "M" | "F" | "U";

export type Nature =
  | "Adamant" | "Bashful" | "Bold" | "Brave" | "Calm"
  | "Careful" | "Docile" | "Gentle" | "Hardy" | "Hasty"
  | "Impish" | "Jolly" | "Lax" | "Lonely" | "Mild"
  | "Modest" | "Naive" | "Naughty" | "Quiet" | "Quirky"
  | "Rash" | "Relaxed" | "Sassy" | "Serious" | "Timid";

export interface StatSpread {
  hp?: number;
  atk?: number;
  def?: number;
  spa?: number;
  spd?: number;
  spe?: number;
}

export interface CompetitiveTeamMember {
  pokemonId: PokemonId;
  species?: string;
  nickname?: string;
  level?: number;
  gender?: Gender;
  nature?: Nature;
  ability?: string;
  item?: string;
  teraType?: string;
  shiny?: boolean;
  happiness?: number;
  evs?: StatSpread;
  ivs?: StatSpread;
  moves?: string[];
}

export interface Team {
  id: string;
  name: string;
  pokemon: PokemonId[];
  competitive?: CompetitiveTeamMember[];
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
  updatedAt: number;
}

export interface TeamActions {
  createTeam: (name: string, isImport?: boolean) => Result<string>;
  deleteTeam: (id: string) => void;
  renameTeam: (id: string, newName: string) => Result;
  duplicateTeam: (id: string) => Result<string>;
  addPokemon: (teamId: string, pokemonId: PokemonId, competitive?: CompetitiveTeamMember) => Result;
  removePokemon: (teamId: string, pokemonId: PokemonId) => Result;
  movePokemon: (teamId: string, fromIndex: number, toIndex: number) => Result;
  clearTeam: (teamId: string) => Result;
  setActiveTeam: (id: string | null) => void;
  getTeam: (id: string) => Team | undefined;
  getAllTeams: () => Team[];
}

export type TeamStore = TeamState & TeamActions;
