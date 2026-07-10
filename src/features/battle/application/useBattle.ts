import { useCallback } from "react";
import { useBattleStore } from "../store/battle.store";

export const useBattle = () => {
  const { battle, initializeBattle, executeAction, resetBattle } = useBattleStore();

  const playerAttack = useCallback((moveName: string, basePower: number) => {
    executeAction({ type: "ATTACK", payload: { moveName, basePower } }, "PLAYER");
  }, [executeAction]);

  const playerSwitch = useCallback((index: number) => {
    executeAction({ type: "SWITCH", payload: { index } }, "PLAYER");
  }, [executeAction]);

  const endTurn = useCallback(() => {
    // If it's the opponent's turn, execute a simple AI action or skip
    if (battle?.state.attacker === "OPPONENT") {
        // Simple AI: always attack with a default move for now
        executeAction({ type: "ATTACK", payload: { moveName: "Tackle", basePower: 40 } }, "OPPONENT");
    }
  }, [battle, executeAction]);

  return {
    battle,
    playerPokemon: battle?.state.player.team[battle.state.player.activePokemonIndex],
    opponentPokemon: battle?.state.opponent.team[battle.state.opponent.activePokemonIndex],
    isPlayerTurn: battle?.state.attacker === "PLAYER",
    status: battle?.state.status,
    winner: battle?.state.winner,
    initializeBattle,
    playerAttack,
    playerSwitch,
    endTurn,
    resetBattle,
  };
};
