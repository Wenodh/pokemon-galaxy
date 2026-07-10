import { Battle, BattleAction, BattleEvent, BattlePokemon, AttackActionPayload, SwitchActionPayload } from "./battle-types";
import { BattleValidator } from "./battle-validator";

export class BattleEngine {
  static createEvent(type: BattleEvent["type"], turn: number, message: string, payload?: any): BattleEvent {
    return {
      id: Math.random().toString(36).substring(2, 9),
      type,
      turn,
      message,
      payload,
    };
  }

  static calculateDamage(attacker: BattlePokemon, defender: BattlePokemon, basePower: number): number {
    const level = attacker.level;
    const attack = attacker.stats.atk;
    const defense = defender.stats.def;
    // Simplified formula: ((2 * Level / 5 + 2) * Base Power * (Atk / Def) / 50) + 2
    const damage = Math.floor(((2 * level / 5 + 2) * basePower * (attack / defense) / 50) + 2);
    return damage;
  }

  static applyAction(battle: Battle, action: BattleAction, participant: "PLAYER" | "OPPONENT"): Battle {
    const validation = BattleValidator.validateAction(battle, action, participant);
    if (!validation.valid) {
      return {
        ...battle,
        log: [...battle.log, this.createEvent("MESSAGE", battle.currentTurn, validation.error || "Invalid action")]
      };
    }

    let nextBattle = { ...battle };
    const state = { ...nextBattle.state };
    const log: BattleEvent[] = [];

    const actor = participant === "PLAYER" ? state.player : state.opponent;
    const target = participant === "PLAYER" ? state.opponent : state.player;
    const activeActor = actor.team[actor.activePokemonIndex];
    const activeTarget = target.team[target.activePokemonIndex];

    if (action.type === "ATTACK") {
      const payload = action.payload as AttackActionPayload;
      log.push(this.createEvent("ATTACK", battle.currentTurn, `${activeActor.name} used ${payload.moveName}!`));

      const damage = this.calculateDamage(activeActor, activeTarget, payload.basePower);
      activeTarget.currentHp = Math.max(0, activeTarget.currentHp - damage);
      log.push(this.createEvent("DAMAGE", battle.currentTurn, `${activeTarget.name} lost ${damage} HP.`, { damage, target: activeTarget.id }));

      if (activeTarget.currentHp === 0) {
        activeTarget.fainted = true;
        log.push(this.createEvent("FAINT", battle.currentTurn, `${activeTarget.name} fainted!`));
      }
    } else if (action.type === "SWITCH") {
      const payload = action.payload as SwitchActionPayload;
      const oldPokemon = actor.team[actor.activePokemonIndex];
      actor.activePokemonIndex = payload.index;
      const newPokemon = actor.team[payload.index];
      log.push(this.createEvent("SWITCH", battle.currentTurn, `${participant} withdrew ${oldPokemon.name} and sent out ${newPokemon.name}!`));
    } else if (action.type === "SKIP") {
      log.push(this.createEvent("MESSAGE", battle.currentTurn, `${participant} skipped their turn.`));
    }

    // Check Victory
    if (BattleValidator.isTeamFainted(state.opponent.team)) {
      state.status = "VICTORY";
      state.winner = "PLAYER";
      log.push(this.createEvent("VICTORY", battle.currentTurn, "Player won the battle!"));
    } else if (BattleValidator.isTeamFainted(state.player.team)) {
      state.status = "DEFEAT";
      state.winner = "OPPONENT";
      log.push(this.createEvent("VICTORY", battle.currentTurn, "Opponent won the battle!"));
    }

    // Update Turn and roles if necessary
    // For this simple foundation, we'll swap attacker/defender
    state.attacker = state.attacker === "PLAYER" ? "OPPONENT" : "PLAYER";
    state.defender = state.defender === "PLAYER" ? "OPPONENT" : "PLAYER";

    if (state.attacker === "PLAYER") {
        nextBattle.currentTurn += 1;
        log.push(this.createEvent("TURN_START", nextBattle.currentTurn, `Turn ${nextBattle.currentTurn}`));
    }

    return {
      ...nextBattle,
      state,
      log: [...nextBattle.log, ...log]
    };
  }
}
