import { useCallback } from "react";
import { useBattleStore } from "../store/battle.store";

export const useBattle = () => {
  const { battle, initializeBattle, executeAction, resolveTurn, resetBattle } = useBattleStore();

  const playerAttack = useCallback((
    moveName: string,
    basePower: number,
    type: string,
    category: any = "PHYSICAL",
    accuracy: number = 100,
    priority: number = 0
  ) => {
    // For now, we'll auto-resolve turns in this foundational phase
    // In a real battle, we'd wait for opponent action
    const playerAction: any = { type: "ATTACK", payload: { moveName, basePower, type, category, accuracy, priority } };
    const opponentAction: any = {
      type: "ATTACK",
      payload: { moveName: "Tackle", basePower: 40, type: "Normal", category: "PHYSICAL", accuracy: 100, priority: 0 }
    };

    resolveTurn(playerAction, opponentAction);
  }, [resolveTurn]);

  const playerSwitch = useCallback((index: number) => {
    executeAction({ type: "SWITCH", payload: { index } }, "PLAYER");
  }, [executeAction]);

  const endTurn = useCallback(() => {
    // Turn resolution is now handled inside playerAttack for the foundation demo
  }, []);

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
