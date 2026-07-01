import { ParsedShowdownTeam, ParsedShowdownPokemon } from "../types/import-export.types";
import { Nature, Gender, StatSpread } from "@/features/team/types/team.types";

export class ShowdownParser {
  /**
   * Parses Pokémon Showdown text format.
   * Supports: Nickname, Species, Gender, Item, Ability, Level, Shiny, Happiness, Nature, EVs, IVs, Tera Type, Moves.
   */
  static parse(text: string): ParsedShowdownTeam {
    const sections = text.split(/\n\s*\n/);
    let teamName = "";
    const pokemon: ParsedShowdownPokemon[] = [];

    // Check for team name header: === Name ===
    const firstLine = text.split("\n")[0].trim();
    const nameMatch = firstLine.match(/^===\s*(.*?)\s*===$/);
    if (nameMatch) {
      teamName = nameMatch[1];
    }

    sections.forEach((section) => {
      const lines = section.split("\n").map(l => l.trim()).filter(l => l && !l.startsWith("==="));
      if (lines.length === 0) return;

      const p: ParsedShowdownPokemon = {
        species: "",
        moves: [],
      };

      // First line: [Nickname (]Species[)] [(G)] [@ Item]
      const firstLine = lines[0];

      // Extract Item
      const itemParts = firstLine.split(" @ ");
      if (itemParts.length > 1) {
        p.item = itemParts[1].trim();
      }

      let speciesAndNickname = itemParts[0].trim();

      // Extract Gender
      const genderMatch = speciesAndNickname.match(/\((M|F)\)$/);
      if (genderMatch) {
        p.gender = genderMatch[1] as Gender;
        speciesAndNickname = speciesAndNickname.replace(/\((M|F)\)$/, "").trim();
      }

      // Extract Nickname and Species
      const nicknameMatch = speciesAndNickname.match(/^(.*?)\s*\((.*?)\)$/);
      if (nicknameMatch) {
        p.nickname = nicknameMatch[1].trim();
        p.species = nicknameMatch[2].trim();
      } else {
        p.species = speciesAndNickname;
      }

      // Parse remaining lines
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];

        if (line.startsWith("Ability: ")) {
          p.ability = line.replace("Ability: ", "").trim();
        } else if (line.startsWith("Level: ")) {
          p.level = parseInt(line.replace("Level: ", "").trim(), 10);
        } else if (line.startsWith("Shiny: ")) {
          p.shiny = line.replace("Shiny: ", "").trim().toLowerCase() === "yes";
        } else if (line.startsWith("Happiness: ")) {
          p.happiness = parseInt(line.replace("Happiness: ", "").trim(), 10);
        } else if (line.startsWith("Tera Type: ")) {
          p.teraType = line.replace("Tera Type: ", "").trim();
        } else if (line.endsWith(" Nature")) {
          p.nature = line.replace(" Nature", "").trim() as Nature;
        } else if (line.startsWith("EVs: ")) {
          p.evs = this.parseStats(line.replace("EVs: ", "").trim());
        } else if (line.startsWith("IVs: ")) {
          p.ivs = this.parseStats(line.replace("IVs: ", "").trim());
        } else if (line.startsWith("- ")) {
          if (p.moves && p.moves.length < 4) {
            p.moves.push(line.replace("- ", "").trim());
          }
        }
      }

      if (p.species) {
        pokemon.push(p);
      }
    });

    return {
      name: teamName,
      pokemon: pokemon,
    };
  }

  private static parseStats(statsLine: string): StatSpread {
    const spread: StatSpread = {};
    const parts = statsLine.split(" / ");

    parts.forEach(part => {
      const [valueStr, statName] = part.trim().split(" ");
      const value = parseInt(valueStr, 10);
      const key = statName.toLowerCase();

      if (key === "hp") spread.hp = value;
      else if (key === "atk") spread.atk = value;
      else if (key === "def") spread.def = value;
      else if (key === "spa") spread.spa = value;
      else if (key === "spd") spread.spd = value;
      else if (key === "spe") spread.spe = value;
    });

    return spread;
  }
}
