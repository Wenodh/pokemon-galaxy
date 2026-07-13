import { Battle, BattlePokemon, BattleEvent, BattleParticipant } from "../battle-types";

export function applyHazards(pokemon: BattlePokemon, participant: BattleParticipant, battle: Battle, log: BattleEvent[]) {
  if (pokemon.fainted) return;

  const hazards = participant.hazards;

  // Stealth Rock
  if (hazards.stealthRock) {
    // Damage based on type effectiveness to Rock. For now, flat 1/8.
    const damage = Math.floor(pokemon.maxHp / 8);
    pokemon.currentHp = Math.max(0, pokemon.currentHp - damage);
    log.push({
      id: Math.random().toString(36).substring(2, 9),
      type: "HAZARD_TRIGGER",
      turn: battle.currentTurn,
      message: `Pointed stones dug into ${pokemon.name}!`,
      payload: { hazard: "Stealth Rock", damage }
    });
    if (pokemon.currentHp === 0) pokemon.fainted = true;
  }

  // Spikes
  if (hazards.spikes > 0 && !pokemon.fainted) {
    const multipliers = [0, 1/8, 1/6, 1/4];
    const damage = Math.floor(pokemon.maxHp * multipliers[hazards.spikes]);
    pokemon.currentHp = Math.max(0, pokemon.currentHp - damage);
    log.push({
      id: Math.random().toString(36).substring(2, 9),
      type: "HAZARD_TRIGGER",
      turn: battle.currentTurn,
      message: `${pokemon.name} is hurt by the spikes!`,
      payload: { hazard: "Spikes", damage }
    });
    if (pokemon.currentHp === 0) pokemon.fainted = true;
  }

  // Toxic Spikes
  if (hazards.toxicSpikes > 0 && !pokemon.fainted) {
      if (pokemon.types.includes("Poison")) {
          participant.hazards.toxicSpikes = 0;
          log.push({
              id: Math.random().toString(36).substring(2, 9),
              type: "MESSAGE",
              turn: battle.currentTurn,
              message: `${pokemon.name} absorbed the toxic spikes!`,
          });
      } else if (pokemon.status === "NONE") {
          pokemon.status = hazards.toxicSpikes === 1 ? "POISON" : "TOXIC";
          pokemon.statusTurns = 0;
          log.push({
              id: Math.random().toString(36).substring(2, 9),
              type: "STATUS_APPLIED",
              turn: battle.currentTurn,
              message: `${pokemon.name} was poisoned by the toxic spikes!`,
              payload: { status: pokemon.status }
          });
      }
  }

  // Sticky Web
  if (hazards.stickyWeb && !pokemon.fainted) {
      pokemon.statChanges.spe = Math.max(-6, pokemon.statChanges.spe - 1);
      log.push({
          id: Math.random().toString(36).substring(2, 9),
          type: "HAZARD_TRIGGER",
          turn: battle.currentTurn,
          message: `${pokemon.name} was caught in a sticky web!`,
          payload: { hazard: "Sticky Web" }
      });
  }
}
