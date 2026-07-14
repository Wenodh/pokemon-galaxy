import { Battle, BattlePokemon, AttackActionPayload, BattleEvent } from "../battle-types";

export interface ItemContext {
  battle: Battle;
  pokemon: BattlePokemon;
  log: BattleEvent[];
}

export interface ItemEffect {
  name: string;
  onBeforeDamage?: (pokemon: BattlePokemon, move: AttackActionPayload, context: ItemContext) => number; // multiplier
  onDamageDealt?: (pokemon: BattlePokemon, damage: number, context: ItemContext) => void;
  onAfterDamageTaken?: (pokemon: BattlePokemon, damage: number, context: ItemContext) => void;
  onEndTurn?: (pokemon: BattlePokemon, context: ItemContext) => void;
  onBeforeFaint?: (pokemon: BattlePokemon, context: ItemContext) => boolean; // return true to prevent faint
}

export const ITEMS: Record<string, ItemEffect> = {
  "Leftovers": {
    name: "Leftovers",
    onEndTurn: (pokemon, { battle, log }) => {
      if (pokemon.currentHp < pokemon.maxHp && !pokemon.fainted) {
        const heal = Math.floor(pokemon.maxHp / 16);
        const actualHeal = Math.min(heal, pokemon.maxHp - pokemon.currentHp);
        pokemon.currentHp += actualHeal;
        log.push({
          id: Math.random().toString(36).substring(2, 9),
          type: "ITEM_TRIGGER",
          turn: battle.currentTurn,
          message: `${pokemon.name} restored a little HP using its Leftovers!`,
          payload: { item: "Leftovers", healing: actualHeal }
        });
      }
    }
  },
  "Life Orb": {
    name: "Life Orb",
    onBeforeDamage: (_pokemon, _move) => 1.3,
    onDamageDealt: (pokemon, _damage, { battle, log }) => {
      const recoil = Math.floor(pokemon.maxHp / 10);
      pokemon.currentHp = Math.max(0, pokemon.currentHp - recoil);
      log.push({
        id: Math.random().toString(36).substring(2, 9),
        type: "RESIDUAL_DAMAGE",
        turn: battle.currentTurn,
        message: `${pokemon.name} lost some HP from its Life Orb!`,
        payload: { item: "Life Orb", damage: recoil }
      });
      if (pokemon.currentHp === 0) pokemon.fainted = true;
    }
  },
  "Choice Scarf": {
    name: "Choice Scarf",
    // Handled in stat calculation usually, but for priority/speed:
    // Speed x 1.5
  },
  "Focus Sash": {
    name: "Focus Sash",
    onBeforeFaint: (pokemon, _context) => {
        if (pokemon.currentHp === pokemon.maxHp) {
            // This is tricky because calculateDamage happens before.
            // Usually handled in the damage application.
            return true;
        }
        return false;
    }
  }
};
