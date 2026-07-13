import { create } from "zustand";
import { Battle, BattleAction, BattlePokemon } from "../domain/battle-types";
import { BattleEngine } from "../domain/battle-engine";

interface BattleStore {
  battle: Battle | null;
  initializeBattle: (playerTeam: BattlePokemon[], opponentTeam: BattlePokemon[]) => void;
  executeAction: (action: BattleAction, participant: "PLAYER" | "OPPONENT") => void;
  resolveTurn: (playerAction: BattleAction, opponentAction: BattleAction) => void;
  resetBattle: () => void;
}

export const useBattleStore = create<BattleStore>((set) => ({
  battle: null,

  initializeBattle: (playerTeam, opponentTeam) => {
    const battle: Battle = {
      id: crypto.randomUUID(),
      seed: Math.floor(Math.random() * 1000000),
      currentTurn: 1,
      state: {
        player: {
          team: playerTeam,
          activePokemonIndex: 0,
          hazards: { stealthRock: false, spikes: 0, toxicSpikes: 0, stickyWeb: false },
          fieldEffects: { reflect: 0, lightScreen: 0, auroraVeil: 0, tailwind: 0 }
        },
        opponent: {
          team: opponentTeam,
          activePokemonIndex: 0,
          hazards: { stealthRock: false, spikes: 0, toxicSpikes: 0, stickyWeb: false },
          fieldEffects: { reflect: 0, lightScreen: 0, auroraVeil: 0, tailwind: 0 }
        },
        status: "ONGOING",
        weather: { type: "NONE", turns: 0 },
        terrain: { type: "NONE", turns: 0 },
        attacker: "PLAYER",
        defender: "OPPONENT",
      },
      log: [
        {
          id: Math.random().toString(36).substring(2, 9),
          type: "BATTLE_START",
          turn: 1,
          message: "Battle Started!"
        },
        {
          id: Math.random().toString(36).substring(2, 9),
          type: "TURN_START",
          turn: 1,
          message: "Turn 1"
        },
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

  resolveTurn: (playerAction, opponentAction) => {
    set((state) => {
      if (!state.battle) return state;
      const updatedBattle = BattleEngine.resolveTurn(state.battle, playerAction, opponentAction);
      return { battle: updatedBattle };
    });
  },

  resetBattle: () => set({ battle: null }),
}));
