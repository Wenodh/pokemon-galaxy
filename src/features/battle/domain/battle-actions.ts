import { BattleAction } from "./battle-types";

export const createAttackAction = (moveName: string, basePower: number): BattleAction => ({
  type: "ATTACK",
  payload: { moveName, basePower }
});

export const createSwitchAction = (index: number): BattleAction => ({
  type: "SWITCH",
  payload: { index }
});

export const createSkipAction = (): BattleAction => ({
  type: "SKIP"
});
