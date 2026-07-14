import { Battle, BattleEvent } from "../battle-types";
import { ABILITIES } from "./abilities";
import { ITEMS } from "./items";
import { STATUS_EFFECTS } from "./status";

export class EndOfTurnProcessor {
  static process(battle: Battle): BattleEvent[] {
    const log: BattleEvent[] = [];

    // 1. Weather residual effects
    this.processWeather(battle, log);

    // 2. Terrain residual effects
    this.processTerrain(battle, log);

    // 3. Status damage
    this.processStatus(battle, "PLAYER", log);
    this.processStatus(battle, "OPPONENT", log);

    // 4. Ability triggers
    this.processAbilities(battle, "PLAYER", log);
    this.processAbilities(battle, "OPPONENT", log);

    // 5. Item triggers (Leftovers)
    this.processItems(battle, "PLAYER", log);
    this.processItems(battle, "OPPONENT", log);

    // 6. Field effects duration decrement
    this.processFieldEffects(battle, log);

    return log;
  }

  private static processWeather(battle: Battle, log: BattleEvent[]) {
    if (battle.state.weather.type !== "NONE") {
      battle.state.weather.turns--;
      if (battle.state.weather.turns === 0) {
        const oldWeather = battle.state.weather.type;
        battle.state.weather.type = "NONE";
        log.push(this.createEvent(battle, "WEATHER_END", `The ${oldWeather.toLowerCase()} subsided.`));
      } else {
          // Residual damage from Sandstorm/Snow
          if (battle.state.weather.type === "SANDSTORM") {
              this.applyWeatherDamage(battle, "PLAYER", "SANDSTORM", log);
              this.applyWeatherDamage(battle, "OPPONENT", "SANDSTORM", log);
          }
      }
    }
  }

  private static applyWeatherDamage(battle: Battle, participant: "PLAYER" | "OPPONENT", weather: string, log: BattleEvent[]) {
      const part = participant === "PLAYER" ? battle.state.player : battle.state.opponent;
      const pokemon = part.team[part.activePokemonIndex];
      if (pokemon.fainted) return;

      // Simplified: non-Rock/Ground/Steel take damage in sand
      const immuneTypes = ["Rock", "Ground", "Steel"];
      if (weather === "SANDSTORM" && !pokemon.types.some(t => immuneTypes.includes(t))) {
          const damage = Math.floor(pokemon.maxHp / 16);
          pokemon.currentHp = Math.max(0, pokemon.currentHp - damage);
          log.push(this.createEvent(battle, "RESIDUAL_DAMAGE", `${pokemon.name} is buffeted by the sandstorm!`, { damage }));
          if (pokemon.currentHp === 0) pokemon.fainted = true;
      }
  }

  private static processTerrain(battle: Battle, log: BattleEvent[]) {
      if (battle.state.terrain.type !== "NONE") {
          battle.state.terrain.turns--;
          if (battle.state.terrain.turns === 0) {
              const oldTerrain = battle.state.terrain.type;
              battle.state.terrain.type = "NONE";
              log.push(this.createEvent(battle, "TERRAIN_END", `The ${oldTerrain.toLowerCase()} terrain disappeared.`));
          }
      }
  }

  private static processStatus(battle: Battle, participant: "PLAYER" | "OPPONENT", log: BattleEvent[]) {
    const part = participant === "PLAYER" ? battle.state.player : battle.state.opponent;
    const pokemon = part.team[part.activePokemonIndex];
    if (pokemon.fainted) return;

    const effect = STATUS_EFFECTS[pokemon.status];
    if (effect?.onEndTurn) {
      effect.onEndTurn(pokemon, { battle, pokemon, log });
    }
  }

  private static processAbilities(battle: Battle, participant: "PLAYER" | "OPPONENT", log: BattleEvent[]) {
    const part = participant === "PLAYER" ? battle.state.player : battle.state.opponent;
    const pokemon = part.team[part.activePokemonIndex];
    if (pokemon.fainted) return;

    const ability = ABILITIES[pokemon.ability];
    if (ability?.onEndTurn) {
      ability.onEndTurn(pokemon, {
        battle,
        actor: participant,
        target: participant === "PLAYER" ? "OPPONENT" : "PLAYER",
        log
      });
    }
  }

  private static processItems(battle: Battle, participant: "PLAYER" | "OPPONENT", log: BattleEvent[]) {
    const part = participant === "PLAYER" ? battle.state.player : battle.state.opponent;
    const pokemon = part.team[part.activePokemonIndex];
    if (pokemon.fainted) return;

    const item = ITEMS[pokemon.item];
    if (item?.onEndTurn) {
      item.onEndTurn(pokemon, { battle, pokemon, log });
    }
  }

  private static processFieldEffects(battle: Battle, log: BattleEvent[]) {
      const participants: ("player" | "opponent")[] = ["player", "opponent"];
      participants.forEach(p => {
          const effects = battle.state[p].fieldEffects;
          if (effects.reflect > 0) {
              effects.reflect--;
              if (effects.reflect === 0) log.push(this.createEvent(battle, "MESSAGE", `${p}'s Reflect wore off!`));
          }
          if (effects.lightScreen > 0) {
              effects.lightScreen--;
              if (effects.lightScreen === 0) log.push(this.createEvent(battle, "MESSAGE", `${p}'s Light Screen wore off!`));
          }
          if (effects.tailwind > 0) {
              effects.tailwind--;
              if (effects.tailwind === 0) log.push(this.createEvent(battle, "MESSAGE", `${p}'s Tailwind expired!`));
          }
      });
  }

  private static createEvent(battle: Battle, type: BattleEvent["type"], message: string, payload?: any): BattleEvent {
    return {
      id: Math.random().toString(36).substring(2, 9),
      type,
      turn: battle.currentTurn,
      message,
      payload,
    };
  }
}
