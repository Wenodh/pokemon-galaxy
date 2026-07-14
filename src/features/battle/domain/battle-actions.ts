import { BattleAction } from "./battle-types";

import { MoveCategory } from "./battle-types";

export const createAttackAction = (
  moveName: string,
  basePower: number,
  type: string,
  category: MoveCategory = "PHYSICAL",
  accuracy: number = 100,
  priority: number = 0
): BattleAction => ({
  type: "ATTACK",
  payload: { moveName, basePower, type, category, accuracy, priority }
});

export const createSwitchAction = (index: number): BattleAction => ({
  type: "SWITCH",
  payload: { index }
});

export const createSkipAction = (): BattleAction => ({
  type: "SKIP"
});
