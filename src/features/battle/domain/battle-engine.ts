import { Battle, BattleAction, BattleEvent, BattlePokemon, AttackActionPayload, SwitchActionPayload } from "./battle-types";
import { BattleValidator } from "./battle-validator";
import { SeededRandom } from "./random";
import { getTypeEffectiveness } from "./type-chart";
import { ABILITIES, EffectContext } from "./effects/abilities";
import { ITEMS, ItemContext } from "./effects/items";
import { STATUS_EFFECTS } from "./effects/status";
import { applyHazards } from "./effects/hazards";
import { EndOfTurnProcessor } from "./effects/end-of-turn";

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

    const pPokemon = battle.state.player.team[battle.state.player.activePokemonIndex];
    const oPokemon = battle.state.opponent.team[battle.state.opponent.activePokemonIndex];

    let pSpeed = pPokemon.stats.spe * this.getStatMultiplier(pPokemon.statChanges.spe);
    let oSpeed = oPokemon.stats.spe * this.getStatMultiplier(oPokemon.statChanges.spe);

    // Apply Paralysis speed drop
    if (pPokemon.status === "PARALYSIS") pSpeed *= 0.5;
    if (oPokemon.status === "PARALYSIS") oSpeed *= 0.5;

    if (pSpeed > oSpeed) return ["PLAYER", "OPPONENT"];
    if (oSpeed > pSpeed) return ["OPPONENT", "PLAYER"];

    return ["PLAYER", "OPPONENT"];
  }

  static getStatMultiplier(stage: number): number {
    if (stage >= 0) return (2 + stage) / 2;
    return 2 / (2 - stage);
  }

  static createEvent(battle: Battle, type: BattleEvent["type"], message: string, payload?: any): BattleEvent {
    return {
      id: Math.random().toString(36).substring(2, 9),
      type,
      turn: battle.currentTurn,
      message,
      payload,
    };
  }

  static calculateDamage(
    attacker: BattlePokemon,
    defender: BattlePokemon,
    move: AttackActionPayload,
    battle: Battle,
    random: SeededRandom
  ): DamageCalculationResult {
    const level = attacker.level;
    const context: EffectContext = {
        battle,
        actor: battle.state.attacker || "PLAYER",
        target: battle.state.defender || "OPPONENT",
        log: []
    };
    const itemContext: ItemContext = { battle, pokemon: attacker, log: [] };

    // Physical vs Special
    let attackStat = move.category === "PHYSICAL" ? attacker.stats.atk : attacker.stats.spa;
    let defenseStat = move.category === "PHYSICAL" ? defender.stats.def : defender.stats.spd;

    // Apply stat changes
    const atkStage = move.category === "PHYSICAL" ? attacker.statChanges.atk : attacker.statChanges.spa;
    const defStage = move.category === "PHYSICAL" ? defender.statChanges.def : defender.statChanges.spd;
    attackStat *= this.getStatMultiplier(atkStage);
    defenseStat *= this.getStatMultiplier(defStage);

    // Status effects
    if (move.category === "PHYSICAL" && attacker.status === "BURN") {
        attackStat *= 0.5;
    }

    // Ability / Item multipliers (Pre-damage)
    let powerMultiplier = 1;
    const atkAbility = ABILITIES[attacker.ability];
    if (atkAbility?.onBeforeDamage) powerMultiplier *= atkAbility.onBeforeDamage(attacker, move, context);

    const atkItem = ITEMS[attacker.item];
    if (atkItem?.onBeforeDamage) powerMultiplier *= atkItem.onBeforeDamage(attacker, move, itemContext);

    const defAbility = ABILITIES[defender.ability];
    if (defAbility?.onBeforeDamage) powerMultiplier *= defAbility.onBeforeDamage(defender, move, { ...context, actor: context.target, target: context.actor });

    // Weather impact
    if (battle.state.weather.type === "RAIN") {
        if (move.type.toLowerCase() === "water") powerMultiplier *= 1.5;
        if (move.type.toLowerCase() === "fire") powerMultiplier *= 0.5;
    } else if (battle.state.weather.type === "SUN") {
        if (move.type.toLowerCase() === "fire") powerMultiplier *= 1.5;
        if (move.type.toLowerCase() === "water") powerMultiplier *= 0.5;
    }

    // Base Damage formula
    let damage = Math.floor(((2 * level / 5 + 2) * move.basePower * powerMultiplier * (attackStat / defenseStat) / 50) + 2);

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

    return { damage, effectiveness, isCritical, isSTAB, roll };
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
        log: [...battle.log, this.createEvent(battle, "MESSAGE", validation.error || "Invalid action")]
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

      // Check Status (Sleep/Freeze/Paralysis)
      const statusEffect = STATUS_EFFECTS[activeActor.status];
      if (statusEffect?.onBeforeMove) {
          const canMove = statusEffect.onBeforeMove(activeActor, { battle: nextBattle, pokemon: activeActor, log });
          if (!canMove) {
              nextBattle.seed = random.getSeed();
              return { ...nextBattle, state, log: [...nextBattle.log, ...log] };
          }
      }

      log.push(this.createEvent(nextBattle, "ATTACK", `${activeActor.name} used ${payload.moveName}!`));

      // Accuracy check
      const hitChance = payload.accuracy === 0 ? 100 : payload.accuracy;
      const hitRoll = random.next() * 100;

      if (hitRoll > hitChance) {
        log.push(this.createEvent(nextBattle, "MESSAGE", `The attack missed!`));
      } else {
        const result = this.calculateDamage(activeActor, activeTarget, payload, nextBattle, random);

        // Handle ability triggers on attack
        const ability = ABILITIES[activeActor.ability];
        if (ability?.onAttack) ability.onAttack(activeActor, payload, { battle: nextBattle, actor: participant, target: participant === "PLAYER" ? "OPPONENT" : "PLAYER", log });

        activeTarget.currentHp = Math.max(0, activeTarget.currentHp - result.damage);

        if (result.isCritical) log.push(this.createEvent(nextBattle, "MESSAGE", "A critical hit!"));
        if (result.effectiveness > 1) log.push(this.createEvent(nextBattle, "MESSAGE", "It's super effective!"));
        else if (result.effectiveness > 0 && result.effectiveness < 1) log.push(this.createEvent(nextBattle, "MESSAGE", "It's not very effective..."));
        else if (result.effectiveness === 0) log.push(this.createEvent(nextBattle, "MESSAGE", `It doesn't affect ${activeTarget.name}...`));

        log.push(this.createEvent(nextBattle, "DAMAGE", `${activeTarget.name} lost ${result.damage} HP.`, { damage: result.damage, target: activeTarget.id }));

        // Handle onDamageDealt triggers
        if (result.damage > 0) {
            const atkItem = ITEMS[activeActor.item];
            if (atkItem?.onDamageDealt) atkItem.onDamageDealt(activeActor, result.damage, { battle: nextBattle, pokemon: activeActor, log });
        }

        if (activeTarget.currentHp === 0) {
          activeTarget.fainted = true;
          log.push(this.createEvent(nextBattle, "FAINT", `${activeTarget.name} fainted!`));
        }
      }
    } else if (action.type === "SWITCH") {
      const payload = action.payload as SwitchActionPayload;
      const oldPokemon = actor.team[actor.activePokemonIndex];
      actor.activePokemonIndex = payload.index;
      const newPokemon = actor.team[payload.index];
      log.push(this.createEvent(nextBattle, "SWITCH", `${participant} withdrew ${oldPokemon.name} and sent out ${newPokemon.name}!`));

      // Apply Hazards on Switch-In
      applyHazards(newPokemon, actor, nextBattle, log);

      // Trigger Switch-In Abilities (Intimidate)
      const ability = ABILITIES[newPokemon.ability];
      if (ability?.onSwitchIn) {
          ability.onSwitchIn(newPokemon, {
              battle: nextBattle,
              actor: participant,
              target: participant === "PLAYER" ? "OPPONENT" : "PLAYER",
              log
          });
      }
    } else if (action.type === "SKIP") {
      log.push(this.createEvent(nextBattle, "MESSAGE", `${participant} skipped their turn.`));
    }

    // Check Victory
    if (BattleValidator.isTeamFainted(state.opponent.team)) {
      state.status = "VICTORY";
      state.winner = "PLAYER";
      log.push(this.createEvent(nextBattle, "VICTORY", "Player won the battle!"));
    } else if (BattleValidator.isTeamFainted(state.player.team)) {
      state.status = "DEFEAT";
      state.winner = "OPPONENT";
      log.push(this.createEvent(nextBattle, "VICTORY", "Opponent won the battle!"));
    }

    if (!isInternal) {
      state.attacker = state.attacker === "PLAYER" ? "OPPONENT" : "PLAYER";
      state.defender = state.defender === "PLAYER" ? "OPPONENT" : "PLAYER";
      if (state.attacker === "PLAYER") {
          nextBattle.currentTurn += 1;
          log.push(this.createEvent(nextBattle, "TURN_START", `Turn ${nextBattle.currentTurn}`));
      }
    }

    nextBattle.seed = random.getSeed();
    return { ...nextBattle, state, log: [...nextBattle.log, ...log] };
  }

  static resolveTurn(
    battle: Battle,
    playerAction: BattleAction,
    opponentAction: BattleAction
  ): Battle {
    const order = this.getTurnOrder(battle, playerAction, opponentAction);
    let currentBattle = { ...battle };

    for (const participant of order) {
      const action = participant === "PLAYER" ? playerAction : opponentAction;
      currentBattle = this.applyAction(currentBattle, action, participant, true);
      if (currentBattle.state.status !== "ONGOING") break;
    }

    if (currentBattle.state.status === "ONGOING") {
      const eotLog = EndOfTurnProcessor.process(currentBattle);
      currentBattle.log = [...currentBattle.log, ...eotLog];

      if (currentBattle.state.status === "ONGOING") {
          currentBattle.currentTurn += 1;
          currentBattle.log.push(this.createEvent(currentBattle, "TURN_START", `Turn ${currentBattle.currentTurn}`));
      }
    }

    return currentBattle;
  }
}
