import { Team, CompetitiveTeamMember } from "@/features/team/types/team.types";

export type ImportExportFormat = "json" | "showdown";

export interface ExportedTeam {
  version: number;
  team: Pick<Team, "id" | "name" | "pokemon" | "competitive">;
  exportedAt: number;
}

export type ImportErrorType =
  | "INVALID_JSON"
  | "INVALID_SCHEMA"
  | "UNSUPPORTED_VERSION"
  | "UNKNOWN_POKEMON"
  | "TEAM_TOO_LARGE"
  | "DUPLICATE_POKEMON"
  | "EMPTY_TEAM"
  | "MALFORMED_SHOWDOWN"
  | "INVALID_EV_RANGE"
  | "INVALID_IV_RANGE"
  | "INVALID_TERA_TYPE"
  | "TOO_MANY_MOVES";

export interface ImportError {
  code: ImportErrorType;
  message: string;
  pokemon?: string; // Optional context for UNKNOWN_POKEMON
}

export interface ImportValidationResult {
  success: boolean;
  team?: {
    name: string;
    pokemonIds: number[];
    competitive?: CompetitiveTeamMember[];
  };
  errors: ImportError[];
}

export interface ParsedShowdownPokemon extends Omit<CompetitiveTeamMember, "pokemonId"> {
  species: string;
}

export interface ParsedShowdownTeam {
  name: string;
  pokemon: ParsedShowdownPokemon[];
}
