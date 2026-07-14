import { Battle, BattlePokemon, BattleEvent, MajorStatus } from "../battle-types";

export interface StatusContext {
  battle: Battle;
  pokemon: BattlePokemon;
  log: BattleEvent[];
}

export interface StatusEffect {
  name: MajorStatus;
  onEndTurn?: (pokemon: BattlePokemon, context: StatusContext) => void;
  onBeforeMove?: (pokemon: BattlePokemon, context: StatusContext) => boolean; // returns false if move fails
  speedMultiplier?: number;
  atkMultiplier?: number;
}

export const STATUS_EFFECTS: Record<MajorStatus, StatusEffect> = {
  "NONE": { name: "NONE" },
  "BURN": {
    name: "BURN",
    atkMultiplier: 0.5,
    onEndTurn: (pokemon, { battle, log }) => {
      const damage = Math.floor(pokemon.maxHp / 16);
      pokemon.currentHp = Math.max(0, pokemon.currentHp - damage);
      log.push({
        id: Math.random().toString(36).substring(2, 9),
        type: "RESIDUAL_DAMAGE",
        turn: battle.currentTurn,
        message: `${pokemon.name} is hurt by its burn!`,
        payload: { status: "BURN", damage }
      });
      if (pokemon.currentHp === 0) pokemon.fainted = true;
    }
  },
  "POISON": {
    name: "POISON",
    onEndTurn: (pokemon, { battle, log }) => {
      const damage = Math.floor(pokemon.maxHp / 8);
      pokemon.currentHp = Math.max(0, pokemon.currentHp - damage);
      log.push({
        id: Math.random().toString(36).substring(2, 9),
        type: "RESIDUAL_DAMAGE",
        turn: battle.currentTurn,
        message: `${pokemon.name} is hurt by poison!`,
        payload: { status: "POISON", damage }
      });
      if (pokemon.currentHp === 0) pokemon.fainted = true;
    }
  },
  "TOXIC": {
    name: "TOXIC",
    onEndTurn: (pokemon, { battle, log }) => {
      pokemon.statusTurns++;
      const damage = Math.floor((pokemon.maxHp * pokemon.statusTurns) / 16);
      pokemon.currentHp = Math.max(0, pokemon.currentHp - damage);
      log.push({
        id: Math.random().toString(36).substring(2, 9),
        type: "RESIDUAL_DAMAGE",
        turn: battle.currentTurn,
        message: `${pokemon.name} is hurt by poison!`,
        payload: { status: "TOXIC", damage }
      });
      if (pokemon.currentHp === 0) pokemon.fainted = true;
    }
  },
  "PARALYSIS": {
    name: "PARALYSIS",
    speedMultiplier: 0.5,
    onBeforeMove: (_pokemon, _context) => {
        // 25% chance to be fully paralyzed
        // This requires SeededRandom in context
        return true;
    }
  },
  "SLEEP": {
    name: "SLEEP",
    onBeforeMove: (pokemon, { battle, log }) => {
        if (pokemon.statusTurns > 0) {
            pokemon.statusTurns--;
            log.push({
                id: Math.random().toString(36).substring(2, 9),
                type: "MESSAGE",
                turn: battle.currentTurn,
                message: `${pokemon.name} is fast asleep.`,
            });
            return false;
        } else {
            pokemon.status = "NONE";
            log.push({
                id: Math.random().toString(36).substring(2, 9),
                type: "MESSAGE",
                turn: battle.currentTurn,
                message: `${pokemon.name} woke up!`,
            });
            return true;
        }
    }
  },
  "FREEZE": {
    name: "FREEZE",
    onBeforeMove: (pokemon, { battle, log }) => {
        log.push({
            id: Math.random().toString(36).substring(2, 9),
            type: "MESSAGE",
            turn: battle.currentTurn,
            message: `${pokemon.name} is frozen solid!`,
        });
        return false;
    }
  }
};
