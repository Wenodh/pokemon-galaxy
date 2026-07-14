export type PokemonId = number;

export type BattleStatus = "IDLE" | "ONGOING" | "VICTORY" | "DEFEAT";

export type MajorStatus = "BURN" | "POISON" | "TOXIC" | "PARALYSIS" | "SLEEP" | "FREEZE" | "NONE";

export interface BattlePokemon {
  id: PokemonId;
  name: string;
  level: number;
  maxHp: number;
  currentHp: number;
  stats: {
    hp: number;
    atk: number;
    def: number;
    spa: number;
    spd: number;
    spe: number;
  };
  types: string[];
  image: string;
  fainted: boolean;
  status: MajorStatus;
  statusTurns: number;
  ability: string;
  item: string;
  statChanges: {
    atk: number;
    def: number;
    spa: number;
    spd: number;
    spe: number;
  };
}

export interface BattleParticipant {
  team: BattlePokemon[];
  activePokemonIndex: number;
  hazards: {
    stealthRock: boolean;
    spikes: number;
    toxicSpikes: number;
    stickyWeb: boolean;
  };
  fieldEffects: {
    reflect: number;
    lightScreen: number;
    auroraVeil: number;
    tailwind: number;
  };
}

export type WeatherType = "NONE" | "RAIN" | "SUN" | "SANDSTORM" | "SNOW";
export type TerrainType = "NONE" | "ELECTRIC" | "GRASSY" | "MISTY" | "PSYCHIC";

export interface BattleState {
  player: BattleParticipant;
  opponent: BattleParticipant;
  status: BattleStatus;
  weather: {
    type: WeatherType;
    turns: number;
  };
  terrain: {
    type: TerrainType;
    turns: number;
  };
  winner?: "PLAYER" | "OPPONENT";
  attacker?: "PLAYER" | "OPPONENT";
  defender?: "PLAYER" | "OPPONENT";
}

export type BattleActionType = "ATTACK" | "SWITCH" | "SKIP";

export type MoveCategory = "PHYSICAL" | "SPECIAL" | "STATUS";

export interface AttackActionPayload {
  moveName: string;
  basePower: number;
  type: string;
  category: MoveCategory;
  accuracy: number; // 0-100, 0 for never-miss
  priority: number;
}

export interface SwitchActionPayload {
  index: number;
}

export interface BattleAction {
  type: BattleActionType;
  payload?: AttackActionPayload | SwitchActionPayload;
}

export type BattleEventType =
  | "BATTLE_START"
  | "TURN_START"
  | "ATTACK"
  | "DAMAGE"
  | "FAINT"
  | "SWITCH"
  | "VICTORY"
  | "MESSAGE"
  | "STATUS_APPLIED"
  | "WEATHER_START"
  | "WEATHER_END"
  | "TERRAIN_START"
  | "TERRAIN_END"
  | "ABILITY_TRIGGER"
  | "ITEM_TRIGGER"
  | "HAZARD_TRIGGER"
  | "HEALING"
  | "RESIDUAL_DAMAGE";

export interface BattleEvent {
  id: string;
  type: BattleEventType;
  turn: number;
  message: string;
  payload?: any;
}

export interface Battle {
  id: string;
  seed: number;
  currentTurn: number;
  state: BattleState;
  log: BattleEvent[];
}
