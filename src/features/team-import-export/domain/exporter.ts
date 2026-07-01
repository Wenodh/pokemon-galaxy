import { Team, CompetitiveTeamMember, StatSpread } from "@/features/team/types/team.types";
import { ExportedTeam } from "../types/import-export.types";
import { IMPORT_EXPORT_VERSION } from "../constants/format-version";
import { PokemonListItem } from "@/features/pokedex/types";

export class TeamExporter {
  /**
   * Exports a team to Pokémon Galaxy JSON format.
   */
  static exportToJson(team: Team): string {
    const exported: ExportedTeam = {
      version: IMPORT_EXPORT_VERSION,
      team: {
        id: team.id,
        name: team.name,
        pokemon: team.pokemon,
        competitive: team.competitive,
      },
      exportedAt: Date.now(),
    };
    return JSON.stringify(exported, null, 2);
  }

  /**
   * Exports a team to Pokémon Showdown text format.
   */
  static exportToShowdown(teamName: string, pokemonDetails: PokemonListItem[], competitive?: CompetitiveTeamMember[]): string {
    let output = `=== ${teamName} ===\n\n`;

    pokemonDetails.forEach((p, index) => {
      const comp = competitive?.[index];

      // Line 1: Nickname (Species) (Gender) @ Item
      let line1 = "";
      if (comp?.nickname) {
          line1 = `${comp.nickname} (${p.name})`;
      } else {
          line1 = p.name;
      }

      if (comp?.gender && comp.gender !== "U") {
          line1 += ` (${comp.gender})`;
      }

      if (comp?.item) {
          line1 += ` @ ${comp.item}`;
      }
      output += `${line1}\n`;

      if (comp?.ability) {
          output += `Ability: ${comp.ability}\n`;
      }

      if (comp?.level && comp.level !== 100) {
          output += `Level: ${comp.level}\n`;
      }

      if (comp?.shiny) {
          output += `Shiny: Yes\n`;
      }

      if (comp?.happiness !== undefined && comp.happiness !== 255) {
          output += `Happiness: ${comp.happiness}\n`;
      }

      if (comp?.teraType) {
          output += `Tera Type: ${comp.teraType}\n`;
      }

      if (comp?.evs) {
          const evString = this.formatStats(comp.evs);
          if (evString) {
              output += `EVs: ${evString}\n`;
          }
      }

      if (comp?.nature) {
          output += `${comp.nature} Nature\n`;
      }

      if (comp?.ivs) {
          const ivString = this.formatStats(comp.ivs);
          if (ivString) {
              output += `IVs: ${ivString}\n`;
          }
      }

      if (comp?.moves && comp.moves.length > 0) {
          comp.moves.forEach(move => {
              output += `- ${move}\n`;
          });
      }

      output += `\n`;
    });

    return output.trim();
  }

  private static formatStats(stats: StatSpread): string {
      const parts: string[] = [];
      if (stats.hp) parts.push(`${stats.hp} HP`);
      if (stats.atk) parts.push(`${stats.atk} Atk`);
      if (stats.def) parts.push(`${stats.def} Def`);
      if (stats.spa) parts.push(`${stats.spa} SpA`);
      if (stats.spd) parts.push(`${stats.spd} SpD`);
      if (stats.spe) parts.push(`${stats.spe} Spe`);
      return parts.join(" / ");
  }

  /**
   * Generates a sanitized filename for the team.
   */
  static getSanitizedFilename(teamName: string): string {
      const sanitized = (teamName || "pokemon-team")
          .replace(/[/\\?%*:|"<>]/g, "-") // Replace invalid chars
          .replace(/\s+/g, " ") // Normalize spaces
          .trim();
      return `${sanitized}.txt`;
  }
}
