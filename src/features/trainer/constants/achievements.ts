import { AchievementDefinition } from "../types";

export const ACHIEVEMENTS_REGISTRY: AchievementDefinition[] = [
  // Living Dex Achievements
  {
    id: "first-catch",
    title: "First Steps",
    description: "Catch your very first Pokémon.",
    category: "LIVING_DEX",
    metric: "pokemonCaught",
    target: 1,
    icon: "CatchIcon",
  },
  {
    id: "catch-10",
    title: "Rising Collector",
    description: "Catch 10 unique Pokémon in your Living Pokédex.",
    category: "LIVING_DEX",
    metric: "pokemonCaught",
    target: 10,
    icon: "CatchIcon",
  },
  {
    id: "catch-100",
    title: "Century Mark",
    description: "Catch 100 unique Pokémon in your Living Pokédex.",
    category: "LIVING_DEX",
    metric: "pokemonCaught",
    target: 100,
    icon: "CatchIcon",
  },
  {
    id: "catch-500",
    title: "Halfway Legend",
    description: "Catch 500 unique Pokémon in your Living Pokédex.",
    category: "LIVING_DEX",
    metric: "pokemonCaught",
    target: 500,
    icon: "CatchIcon",
  },
  {
    id: "living-dex-seen-100",
    title: "Keen Observer",
    description: "Encounter or see 100 unique Pokémon.",
    category: "LIVING_DEX",
    metric: "pokemonSeen",
    target: 100,
    icon: "SeenIcon",
  },

  // Collections Achievements
  {
    id: "first-collection",
    title: "My Museum",
    description: "Create your very first custom collection.",
    category: "COLLECTIONS",
    metric: "collectionsCreated",
    target: 1,
    icon: "CollectionIcon",
  },
  {
    id: "collector",
    title: "Curator",
    description: "Create 5 distinct custom collections.",
    category: "COLLECTIONS",
    metric: "collectionsCreated",
    target: 5,
    icon: "CollectionIcon",
  },
  {
    id: "pokemon-collections-50",
    title: "Grand Organizer",
    description: "Add a total of 50 Pokémon into your custom collections.",
    category: "COLLECTIONS",
    metric: "pokemonInCollections",
    target: 50,
    icon: "CollectionIcon",
  },

  // Teams Achievements
  {
    id: "first-team",
    title: "Assemble!",
    description: "Create your first custom team.",
    category: "TEAMS",
    metric: "teamsCreated",
    target: 1,
    icon: "TeamIcon",
  },
  {
    id: "team-builder",
    title: "Gym Leader",
    description: "Build 5 custom teams in your team builder.",
    category: "TEAMS",
    metric: "teamsCreated",
    target: 5,
    icon: "TeamIcon",
  },

  // Analysis Achievements
  {
    id: "first-analysis",
    title: "Analytical Mind",
    description: "Trigger your first team analysis report.",
    category: "ANALYSIS",
    metric: "teamAnalyses",
    target: 1,
    icon: "AnalysisIcon",
  },
  {
    id: "analyze-10",
    title: "Tactician",
    description: "Perform 10 team analyses to optimize your battle strategies.",
    category: "ANALYSIS",
    metric: "teamAnalyses",
    target: 10,
    icon: "AnalysisIcon",
  },

  // Exploration Achievements
  {
    id: "view-100",
    title: "World Traveler",
    description: "View the details page of 100 different Pokémon.",
    category: "EXPLORATION",
    metric: "viewedPokemon",
    target: 100,
    icon: "ExploreIcon",
  },
  {
    id: "favorite-10",
    title: "Deep Affection",
    description: "Mark 10 Pokémon as your favorites.",
    category: "EXPLORATION",
    metric: "favoritesCount",
    target: 10,
    icon: "FavoriteIcon",
  },
];
