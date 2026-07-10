import { create } from "zustand";
import { Battle, BattleAction, BattlePokemon } from "../domain/battle-types";
import { BattleEngine } from "../domain/battle-engine";

interface BattleStore {
  battle: Battle | null;
  initializeBattle: (playerTeam: BattlePokemon[], opponentTeam: BattlePokemon[]) => void;
  executeAction: (action: BattleAction, participant: "PLAYER" | "OPPONENT") => void;
  resetBattle: () => void;
}

export const useBattleStore = create<BattleStore>((set) => ({
  battle: null,

  initializeBattle: (playerTeam, opponentTeam) => {
    const battle: Battle = {
      id: crypto.randomUUID(),
      currentTurn: 1,
      state: {
        player: {
          team: playerTeam,
          activePokemonIndex: 0,
        },
        opponent: {
          team: opponentTeam,
          activePokemonIndex: 0,
        },
        status: "ONGOING",
        attacker: "PLAYER",
        defender: "OPPONENT",
      },
      log: [
        BattleEngine.createEvent("BATTLE_START", 1, "Battle Started!"),
        BattleEngine.createEvent("TURN_START", 1, "Turn 1"),
      ],
    };
    set({ battle });
  },

  executeAction: (action, participant) => {
    set((state) => {
      if (!state.battle) return state;
      const updatedBattle = BattleEngine.applyAction(state.battle, action, participant);
      return { battle: updatedBattle };
    });
  },

  resetBattle: () => set({ battle: null }),
}));
