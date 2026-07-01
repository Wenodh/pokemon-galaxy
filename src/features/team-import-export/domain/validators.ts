import { ImportValidationResult, ImportError } from "../types/import-export.types";
import { IMPORT_EXPORT_VERSION } from "../constants/format-version";
import { ParsedShowdownTeam } from "../types/import-export.types";
import { CompetitiveTeamMember, StatSpread } from "@/features/team/types/team.types";

const VALID_TYPES = [
  "Normal", "Fire", "Water", "Grass", "Electric", "Ice", "Fighting", "Poison",
  "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dragon", "Steel", "Dark", "Fairy", "Stellar"
];

const VALID_NATURES = [
  "Adamant", "Bashful", "Bold", "Brave", "Calm",
  "Careful", "Docile", "Gentle", "Hardy", "Hasty",
  "Impish", "Jolly", "Lax", "Lonely", "Mild",
  "Modest", "Naive", "Naughty", "Quiet", "Quirky",
  "Rash", "Relaxed", "Sassy", "Serious", "Timid"
];

export class TeamValidator {
  /**
   * Validates the structure and content of a JSON-exported team.
   */
  static validateJson(data: any): ImportValidationResult {
    const errors: ImportError[] = [];

    if (!data || typeof data !== "object") {
      return {
        success: false,
        errors: [{ code: "INVALID_JSON", message: "Input is not a valid JSON object." }],
      };
    }

    if (data.version === undefined) {
      errors.push({ code: "INVALID_SCHEMA", message: "Missing version field." });
    } else if (data.version > IMPORT_EXPORT_VERSION) {
      errors.push({
        code: "UNSUPPORTED_VERSION",
        message: `Version ${data.version} is not supported. Max version is ${IMPORT_EXPORT_VERSION}.`,
      });
    }

    if (!data.team) {
      errors.push({ code: "INVALID_SCHEMA", message: "Missing team data." });
    } else {
      const { name, pokemon, competitive } = data.team;

      if (!name || typeof name !== "string") {
        errors.push({ code: "INVALID_SCHEMA", message: "Invalid or missing team name." });
      }

      if (!Array.isArray(pokemon)) {
        errors.push({ code: "INVALID_SCHEMA", message: "Missing or invalid Pokémon list." });
      } else {
        if (pokemon.length === 0) {
          errors.push({ code: "EMPTY_TEAM", message: "Team must contain at least one Pokémon." });
        }
        if (pokemon.length > 6) {
          errors.push({ code: "TEAM_TOO_LARGE", message: "Team cannot contain more than 6 Pokémon." });
        }

        const uniqueIds = new Set(pokemon);
        if (uniqueIds.size !== pokemon.length) {
          errors.push({ code: "DUPLICATE_POKEMON", message: "Team contains duplicate Pokémon IDs." });
        }

        // Basic ID validation (should be numbers)
        if (pokemon.some(id => typeof id !== "number")) {
           errors.push({ code: "INVALID_SCHEMA", message: "Pokémon IDs must be numbers." });
        }

        // Validate competitive data if present
        if (competitive && Array.isArray(competitive)) {
            competitive.forEach((p: CompetitiveTeamMember, i: number) => {
                const pokemonName = `Pokémon #${i + 1}`;
                this.validateCompetitiveMember(p, pokemonName, errors);
            });
        }
      }
    }

    if (errors.length > 0) {
      return { success: false, errors };
    }

    return {
      success: true,
      team: {
        name: data.team.name,
        pokemonIds: data.team.pokemon,
        competitive: data.team.competitive,
      },
      errors: [],
    };
  }

  /**
   * Validates the intermediate results of a Showdown import after name resolution.
   */
  static validateShowdownResults(
    parsed: ParsedShowdownTeam,
    resolvedIds: (number | null)[]
  ): ImportValidationResult {
    const errors: ImportError[] = [];

    if (parsed.pokemon.length === 0) {
        errors.push({ code: "EMPTY_TEAM", message: "No Pokémon found in Showdown text." });
    }

    if (parsed.pokemon.length > 6) {
        errors.push({ code: "TEAM_TOO_LARGE", message: "Showdown team exceeds 6 Pokémon." });
    }

    const competitive: CompetitiveTeamMember[] = [];
    const pokemonIds: number[] = [];

    parsed.pokemon.forEach((p, index) => {
      const id = resolvedIds[index];
      const pokemonName = p.species || `Pokémon #${index + 1}`;

      if (id === null) {
        errors.push({
          code: "UNKNOWN_POKEMON",
          message: `Could not resolve Pokémon: "${p.species}"`,
          pokemon: p.species,
        });
      } else {
          pokemonIds.push(id);
          competitive.push({
              ...p,
              pokemonId: id
          });
      }

      this.validateCompetitiveMember(p as any, pokemonName, errors);
    });

    const validIds = resolvedIds.filter((id): id is number => id !== null);
    const uniqueIds = new Set(validIds);
    if (uniqueIds.size !== validIds.length) {
        errors.push({ code: "DUPLICATE_POKEMON", message: "Import contains duplicate Pokémon." });
    }

    if (errors.length > 0) {
      return { success: false, errors };
    }

    return {
      success: true,
      team: {
        name: parsed.name || "Imported Showdown Team",
        pokemonIds,
        competitive,
      },
      errors: [],
    };
  }

  private static validateCompetitiveMember(p: CompetitiveTeamMember, pokemonName: string, errors: ImportError[]) {
      // Moves
      if (p.moves && p.moves.length > 4) {
          errors.push({
              code: "TOO_MANY_MOVES",
              message: `${pokemonName} has more than 4 moves.`,
              pokemon: pokemonName
          });
      }

      // EVs
      if (p.evs) {
          this.validateStatSpread(p.evs, pokemonName, "EV", 252, 510, errors);
      }

      // IVs
      if (p.ivs) {
          this.validateStatSpread(p.ivs, pokemonName, "IV", 31, Infinity, errors);
      }

      // Tera Type
      if (p.teraType) {
          const normalizedTera = p.teraType.charAt(0).toUpperCase() + p.teraType.slice(1).toLowerCase();
          if (!VALID_TYPES.includes(normalizedTera)) {
              errors.push({
                  code: "INVALID_TERA_TYPE",
                  message: `${pokemonName} has an invalid Tera Type: ${p.teraType}`,
                  pokemon: pokemonName
              });
          }
      }

      // Nature
      if (p.nature) {
          if (!VALID_NATURES.includes(p.nature)) {
              errors.push({
                  code: "MALFORMED_SHOWDOWN",
                  message: `${pokemonName} has an invalid Nature: ${p.nature}`,
                  pokemon: pokemonName
              });
          }
      }
  }

  private static validateStatSpread(
      spread: StatSpread,
      pokemonName: string,
      type: "EV" | "IV",
      maxSingle: number,
      maxTotal: number,
      errors: ImportError[]
  ) {
      let total = 0;
      const stats: (keyof StatSpread)[] = ["hp", "atk", "def", "spa", "spd", "spe"];

      stats.forEach(stat => {
          const val = spread[stat];
          if (val !== undefined) {
              if (val < 0 || val > maxSingle) {
                  errors.push({
                      code: type === "EV" ? "INVALID_EV_RANGE" : "INVALID_IV_RANGE",
                      message: `${pokemonName} has invalid ${type} for ${stat.toUpperCase()}: ${val} (must be 0-${maxSingle})`,
                      pokemon: pokemonName
                  });
              }
              total += val;
          }
      });

      if (total > maxTotal) {
          errors.push({
              code: type === "EV" ? "INVALID_EV_RANGE" : "INVALID_IV_RANGE",
              message: `${pokemonName} has invalid total ${type}s: ${total} (max ${maxTotal})`,
              pokemon: pokemonName
          });
      }
  }
}
