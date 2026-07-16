export type AchievementCategory = 'LIVING_DEX' | 'COLLECTIONS' | 'TEAMS' | 'ANALYSIS' | 'EXPLORATION';

export type TrainerMetric =
  | 'pokemonSeen'
  | 'pokemonCaught'
  | 'collectionsCreated'
  | 'pokemonInCollections'
  | 'teamsCreated'
  | 'teamAnalyses'
  | 'favoritesCount'
  | 'viewedPokemon'
  | 'exportedCollections'
  | 'importedCollections';

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  metric: TrainerMetric;
  target: number;
  icon: string;
}

export interface AchievementProgress {
  id: string;
  completed: boolean;
  completedAt?: number;
  progress: number; // Current value relative to target
}

export interface TimelineEvent {
  id: string;
  type:
    | 'COLLECTION_CREATED'
    | 'POKEMON_CAUGHT'
    | 'POKEMON_SEEN'
    | 'TEAM_CREATED'
    | 'TEAM_ANALYZED'
    | 'FAVORITE_ADDED'
    | 'ACHIEVEMENT_UNLOCKED'
    | 'MILESTONE_REACHED';
  title: string;
  description: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface TrainerStatistics {
  pokemonSeen: number;
  pokemonCaught: number;
  livingDexCompletion: number; // percentage (0 - 100)
  collectionsCreated: number;
  pokemonInCollections: number;
  teamsCreated: number;
  teamAnalyses: number;
  favoritesCount: number;
  viewedPokemon: number;
  exportedCollections: number;
  importedCollections: number;
}

export interface TrainerProfile {
  id: string;
  name: string;
  avatarStyle: 'initials' | 'pixel' | 'retro' | 'abstract';
  avatarColor: string; // Tailwind bg color class
  createdAt: number;
  updatedAt: number;
  favoritePokemonId?: number;
  favoriteType?: string;
  completedMilestones: number[]; // e.g. [10, 25, 50, 75, 90, 100]
  completedAchievements: Record<string, number>; // achievementId -> completedAt timestamp
}

export type TrainerEvent =
  | { type: 'COLLECTION_CREATED'; name: string; collectionId: string }
  | { type: 'POKEMON_CAUGHT'; id: number; name: string }
  | { type: 'POKEMON_SEEN'; id: number; name: string }
  | { type: 'TEAM_CREATED'; name: string; teamId: string }
  | { type: 'TEAM_DUPLICATED'; name: string; teamId: string }
  | { type: 'TEAM_IMPORTED'; name: string; teamId: string }
  | { type: 'TEAM_ANALYZED'; name: string; score: number }
  | { type: 'FAVORITE_ADDED'; id: number; name: string }
  | { type: 'FAVORITE_REMOVED'; id: number; name: string }
  | { type: 'POKEMON_VIEWED'; id: number; name: string }
  | { type: 'COLLECTION_EXPORTED'; name: string }
  | { type: 'COLLECTION_IMPORTED'; name: string };
