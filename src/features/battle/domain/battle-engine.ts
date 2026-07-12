import { Battle, BattleAction, BattleEvent, BattlePokemon, AttackActionPayload, SwitchActionPayload } from "./battle-types";
import { BattleValidator } from "./battle-validator";
import { SeededRandom } from "./random";
import { getTypeEffectiveness } from "./type-chart";

export interface DamageCalculationResult {
  damage: number;
  effectiveness: number;
  isCritical: boolean;
  isSTAB: boolean;
  roll: number;
}

export class BattleEngine {
  static CRITICAL_CHANCE = 6.25; // 1/16
  static CRITICAL_MULTIPLIER = 1.5;
  static STAB_MULTIPLIER = 1.5;

  static getTurnOrder(
    battle: Battle,
    playerAction: BattleAction,
    opponentAction: BattleAction
  ): ("PLAYER" | "OPPONENT")[] {
    const pPriority = playerAction.type === "SWITCH" ? 6 : (playerAction.payload as AttackActionPayload)?.priority ?? 0;
    const oPriority = opponentAction.type === "SWITCH" ? 6 : (opponentAction.payload as AttackActionPayload)?.priority ?? 0;

    if (pPriority > oPriority) return ["PLAYER", "OPPONENT"];
    if (oPriority > pPriority) return ["OPPONENT", "PLAYER"];

    const pSpeed = battle.state.player.team[battle.state.player.activePokemonIndex].stats.spe;
    const oSpeed = battle.state.opponent.team[battle.state.opponent.activePokemonIndex].stats.spe;

    if (pSpeed > oSpeed) return ["PLAYER", "OPPONENT"];
    if (oSpeed > pSpeed) return ["OPPONENT", "PLAYER"];

    // Deterministic tie-breaker: Player goes first
    return ["PLAYER", "OPPONENT"];
  }

  static createEvent(type: BattleEvent["type"], turn: number, message: string, payload?: any): BattleEvent {
    return {
      id: Math.random().toString(36).substring(2, 9),
      type,
      turn,
      message,
      payload,
    };
  }

  static calculateDamage(
    attacker: BattlePokemon,
    defender: BattlePokemon,
    move: AttackActionPayload,
    random: SeededRandom
  ): DamageCalculationResult {
    const level = attacker.level;

    // Physical vs Special
    const attackStat = move.category === "PHYSICAL" ? attacker.stats.atk : attacker.stats.spa;
    const defenseStat = move.category === "PHYSICAL" ? defender.stats.def : defender.stats.spd;

    // Base Damage formula
    let damage = Math.floor(((2 * level / 5 + 2) * move.basePower * (attackStat / defenseStat) / 50) + 2);

    // Critical Hit
    const isCritical = random.next() * 100 < this.CRITICAL_CHANCE;
    if (isCritical) {
      damage = Math.floor(damage * this.CRITICAL_MULTIPLIER);
    }

    // Random Roll (0.85 - 1.00)
    const roll = (random.nextInt(85, 100) / 100);
    damage = Math.floor(damage * roll);

    // STAB
    const isSTAB = attacker.types.some(t => t.toLowerCase() === move.type.toLowerCase());
    if (isSTAB) {
      damage = Math.floor(damage * this.STAB_MULTIPLIER);
    }

    // Type Effectiveness
    const effectiveness = getTypeEffectiveness(move.type, defender.types);
    damage = Math.floor(damage * effectiveness);

    return {
      damage,
      effectiveness,
      isCritical,
      isSTAB,
      roll
    };
  }

  static applyAction(
    battle: Battle,
    action: BattleAction,
    participant: "PLAYER" | "OPPONENT",
    isInternal: boolean = false
  ): Battle {
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
    const random = new SeededRandom(nextBattle.seed);

    const actor = participant === "PLAYER" ? state.player : state.opponent;
    const target = participant === "PLAYER" ? state.opponent : state.player;
    const activeActor = actor.team[actor.activePokemonIndex];
    const activeTarget = target.team[target.activePokemonIndex];

    if (action.type === "ATTACK") {
      const payload = action.payload as AttackActionPayload;
      log.push(this.createEvent("ATTACK", battle.currentTurn, `${activeActor.name} used ${payload.moveName}!`));

      // Accuracy check
      const hitChance = payload.accuracy === 0 ? 100 : payload.accuracy;
      const hitRoll = random.next() * 100;

      if (hitRoll > hitChance) {
        log.push(this.createEvent("MESSAGE", battle.currentTurn, `The attack missed!`));
      } else {
        const result = this.calculateDamage(activeActor, activeTarget, payload, random);
        activeTarget.currentHp = Math.max(0, activeTarget.currentHp - result.damage);

        if (result.isCritical) {
          log.push(this.createEvent("MESSAGE", battle.currentTurn, "A critical hit!"));
        }

        if (result.effectiveness > 1) {
          log.push(this.createEvent("MESSAGE", battle.currentTurn, "It's super effective!"));
        } else if (result.effectiveness > 0 && result.effectiveness < 1) {
          log.push(this.createEvent("MESSAGE", battle.currentTurn, "It's not very effective..."));
        } else if (result.effectiveness === 0) {
          log.push(this.createEvent("MESSAGE", battle.currentTurn, `It doesn't affect ${activeTarget.name}...`));
        }

        log.push(this.createEvent("DAMAGE", battle.currentTurn, `${activeTarget.name} lost ${result.damage} HP.`, { damage: result.damage, target: activeTarget.id }));

        if (activeTarget.currentHp === 0) {
          activeTarget.fainted = true;
          log.push(this.createEvent("FAINT", battle.currentTurn, `${activeTarget.name} fainted!`));
        }
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

    // Only swap roles and update turn if NOT internal (individual action processing)
    if (!isInternal) {
      state.attacker = state.attacker === "PLAYER" ? "OPPONENT" : "PLAYER";
      state.defender = state.defender === "PLAYER" ? "OPPONENT" : "PLAYER";

      if (state.attacker === "PLAYER") {
          nextBattle.currentTurn += 1;
          log.push(this.createEvent("TURN_START", nextBattle.currentTurn, `Turn ${nextBattle.currentTurn}`));
      }
    }

    // Update seed for next action to maintain sequence but ensure determinism
    nextBattle.seed = random.getSeed();

    return {
      ...nextBattle,
      state,
      log: [...nextBattle.log, ...log]
    };
  }

  static resolveTurn(
    battle: Battle,
    playerAction: BattleAction,
    opponentAction: BattleAction
  ): Battle {
    const order = this.getTurnOrder(battle, playerAction, opponentAction);
    let currentBattle = { ...battle };

    // Clear log for this resolve step if needed, or just append
    // But we should push TURN_START if it's the beginning of a cycle
    // In this model, resolveTurn is called ONCE per pair of actions

    for (const participant of order) {
      const action = participant === "PLAYER" ? playerAction : opponentAction;
      currentBattle = this.applyAction(currentBattle, action, participant, true);
      if (currentBattle.state.status !== "ONGOING") break;
    }

    // After both actions, increment turn and swap back to player for UI input
    if (currentBattle.state.status === "ONGOING") {
      currentBattle.currentTurn += 1;
      currentBattle.log.push(this.createEvent("TURN_START", currentBattle.currentTurn, `Turn ${currentBattle.currentTurn}`));
    }

    return currentBattle;
  }
}
