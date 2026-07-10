import { Battle, BattleAction, BattlePokemon } from "./battle-types";

export class BattleValidator {
  static validateAction(battle: Battle, action: BattleAction, participant: "PLAYER" | "OPPONENT"): { valid: boolean; error?: string } {
    const state = battle.state;
    const currentParticipant = participant === "PLAYER" ? state.player : state.opponent;
    const activePokemon = currentParticipant.team[currentParticipant.activePokemonIndex];

    if (battle.state.status !== "ONGOING") {
      return { valid: false, error: "Battle is not ongoing." };
    }

    if (activePokemon.fainted) {
      return { valid: false, error: "Active Pokémon is fainted." };
    }

    switch (action.type) {
      case "ATTACK":
        return { valid: true };
      case "SWITCH":
        const switchPayload = action.payload as { index: number };
        const targetPokemon = currentParticipant.team[switchPayload.index];
        if (!targetPokemon) {
          return { valid: false, error: "Invalid Pokémon index." };
        }
        if (targetPokemon.fainted) {
          return { valid: false, error: "Cannot switch to a fainted Pokémon." };
        }
        if (switchPayload.index === currentParticipant.activePokemonIndex) {
          return { valid: false, error: "Pokémon is already active." };
        }
        return { valid: true };
      case "SKIP":
        return { valid: true };
      default:
        return { valid: false, error: "Unknown action type." };
    }
  }

  static isTeamFainted(team: BattlePokemon[]): boolean {
    return team.every(p => p.fainted);
  }
}
