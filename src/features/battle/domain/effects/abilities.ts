import { Battle, BattlePokemon, AttackActionPayload, BattleEvent } from "../battle-types";

export interface EffectContext {
  battle: Battle;
  actor: "PLAYER" | "OPPONENT";
  target: "PLAYER" | "OPPONENT";
  log: BattleEvent[];
}

export interface AbilityEffect {
  name: string;
  onSwitchIn?: (pokemon: BattlePokemon, context: EffectContext) => void;
  onAttack?: (pokemon: BattlePokemon, move: AttackActionPayload, context: EffectContext) => void;
  onBeforeDamage?: (pokemon: BattlePokemon, move: AttackActionPayload, context: EffectContext) => number; // returns multiplier
  onDamageDealt?: (pokemon: BattlePokemon, damage: number, context: EffectContext) => void;
  onEndTurn?: (pokemon: BattlePokemon, context: EffectContext) => void;
}

export const ABILITIES: Record<string, AbilityEffect> = {
  "Levitate": {
    name: "Levitate",
    onBeforeDamage: (_pokemon, move) => {
      if (move.type.toLowerCase() === "ground") return 0;
      return 1;
    }
  },
  "Intimidate": {
    name: "Intimidate",
    onSwitchIn: (pokemon, { battle, target, log }) => {
      const targetParticipant = target === "PLAYER" ? battle.state.player : battle.state.opponent;
      const activeTarget = targetParticipant.team[targetParticipant.activePokemonIndex];
      if (!activeTarget.fainted) {
        activeTarget.statChanges.atk = Math.max(-6, activeTarget.statChanges.atk - 1);
        log.push({
          id: Math.random().toString(36).substring(2, 9),
          type: "ABILITY_TRIGGER",
          turn: battle.currentTurn,
          message: `${pokemon.name}'s Intimidate lowered ${activeTarget.name}'s Attack!`,
          payload: { ability: "Intimidate", target: activeTarget.id }
        });
      }
    }
  },
  "Blaze": {
    name: "Blaze",
    onBeforeDamage: (pokemon, move) => {
      if (move.type.toLowerCase() === "fire" && pokemon.currentHp <= pokemon.maxHp / 3) {
        return 1.5;
      }
      return 1;
    }
  },
  "Static": {
    name: "Static",
    onDamageDealt: (_pokemon, _damage, _context) => {
        // Simplified: 30% chance to paralyze attacker on contact (assuming all moves for now)
        // Need to add contact property to moves later, but for foundation we just trigger
    }
  }
};
