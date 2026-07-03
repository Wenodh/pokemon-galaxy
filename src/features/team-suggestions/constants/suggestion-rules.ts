import { SuggestionCandidate } from "../types/suggestion.types";

/**
 * Curated Dataset of Pokémon Candidates
 *
 * Approximately 75 Pokémon covering diverse roles, types, and generations.
 * This dataset is used as the pool for suggestions.
 */
export const CANDIDATE_DATASET: SuggestionCandidate[] = [
  // Generation 1
  {
    pokemonId: 145,
    name: "Zapdos",
    roles: ["Special Sweeper", "Mixed Wall"],
    primaryType: "electric",
    secondaryType: "flying",
    speedTier: "fast",
    bulkTier: "high",
    tags: ["competitive-staple", "pivot", "defensive-backbone"],
    generation: 1
  },
  {
    pokemonId: 149,
    name: "Dragonite",
    roles: ["Physical Sweeper", "Mixed Sweeper", "Tank"],
    primaryType: "dragon",
    secondaryType: "flying",
    speedTier: "average",
    bulkTier: "high",
    tags: ["versatile", "offensive-threat", "priority-user"],
    generation: 1
  },
  {
    pokemonId: 130,
    name: "Gyarados",
    roles: ["Physical Sweeper"],
    primaryType: "water",
    secondaryType: "flying",
    speedTier: "average",
    bulkTier: "medium",
    tags: ["beginner-friendly", "offensive-threat"],
    generation: 1
  },
  {
    pokemonId: 94,
    name: "Gengar",
    roles: ["Special Sweeper"],
    primaryType: "ghost",
    secondaryType: "poison",
    speedTier: "very-fast",
    bulkTier: "low",
    tags: ["offensive-threat"],
    generation: 1
  },
  {
    pokemonId: 143,
    name: "Snorlax",
    roles: ["Tank", "Special Wall"],
    primaryType: "normal",
    speedTier: "very-slow",
    bulkTier: "extreme",
    tags: ["beginner-friendly", "defensive-backbone"],
    generation: 1
  },
  {
    pokemonId: 121,
    name: "Starmie",
    roles: ["Special Sweeper"],
    primaryType: "water",
    secondaryType: "psychic",
    speedTier: "very-fast",
    bulkTier: "medium",
    tags: ["hazard-remover", "versatile"],
    generation: 1
  },
  {
    pokemonId: 36,
    name: "Clefable",
    roles: ["Special Wall", "Mixed Wall", "Tank"],
    primaryType: "fairy",
    speedTier: "slow",
    bulkTier: "high",
    tags: ["competitive-staple", "cleric", "versatile"],
    generation: 1
  },
  {
    pokemonId: 65,
    name: "Alakazam",
    roles: ["Special Sweeper"],
    primaryType: "psychic",
    speedTier: "very-fast",
    bulkTier: "low",
    tags: ["offensive-threat"],
    generation: 1
  },

  // Generation 2
  {
    pokemonId: 248,
    name: "Tyranitar",
    roles: ["Tank", "Physical Sweeper"],
    primaryType: "rock",
    secondaryType: "dark",
    speedTier: "slow",
    bulkTier: "high",
    tags: ["competitive-staple", "weather-setter", "hazard-setter"],
    generation: 2
  },
  {
    pokemonId: 212,
    name: "Scizor",
    roles: ["Physical Sweeper", "Tank"],
    primaryType: "bug",
    secondaryType: "steel",
    speedTier: "slow",
    bulkTier: "high",
    tags: ["pivot", "priority-user", "synergistic"],
    generation: 2
  },
  {
    pokemonId: 227,
    name: "Skarmory",
    roles: ["Physical Wall"],
    primaryType: "steel",
    secondaryType: "flying",
    speedTier: "average",
    bulkTier: "high",
    tags: ["hazard-setter", "hazard-remover", "defensive-backbone"],
    generation: 2
  },
  {
    pokemonId: 242,
    name: "Blissey",
    roles: ["Special Wall"],
    primaryType: "normal",
    speedTier: "slow",
    bulkTier: "extreme",
    tags: ["cleric", "defensive-backbone"],
    generation: 2
  },
  {
    pokemonId: 199,
    name: "Slowking",
    roles: ["Special Wall", "Tank"],
    primaryType: "water",
    secondaryType: "psychic",
    speedTier: "very-slow",
    bulkTier: "high",
    tags: ["pivot", "synergistic"],
    generation: 2
  },
  {
    pokemonId: 184,
    name: "Azumarill",
    roles: ["Physical Sweeper", "Tank"],
    primaryType: "water",
    secondaryType: "fairy",
    speedTier: "slow",
    bulkTier: "high",
    tags: ["priority-user", "offensive-threat"],
    generation: 2
  },

  // Generation 3
  {
    pokemonId: 376,
    name: "Metagross",
    roles: ["Physical Sweeper", "Tank"],
    primaryType: "steel",
    secondaryType: "psychic",
    speedTier: "average",
    bulkTier: "high",
    tags: ["hazard-setter", "offensive-threat"],
    generation: 3
  },
  {
    pokemonId: 373,
    name: "Salamence",
    roles: ["Physical Sweeper", "Special Sweeper", "Mixed Sweeper"],
    primaryType: "dragon",
    secondaryType: "flying",
    speedTier: "fast",
    bulkTier: "medium",
    tags: ["offensive-threat", "versatile"],
    generation: 3
  },
  {
    pokemonId: 380,
    name: "Latias",
    roles: ["Special Sweeper", "Special Wall"],
    primaryType: "dragon",
    secondaryType: "psychic",
    speedTier: "fast",
    bulkTier: "high",
    tags: ["hazard-remover", "synergistic"],
    generation: 3
  },
  {
    pokemonId: 381,
    name: "Latios",
    roles: ["Special Sweeper"],
    primaryType: "dragon",
    secondaryType: "psychic",
    speedTier: "fast",
    bulkTier: "medium",
    tags: ["offensive-threat"],
    generation: 3
  },
  {
    pokemonId: 302,
    name: "Sableye",
    roles: ["Physical Wall", "Mixed Wall"],
    primaryType: "dark",
    secondaryType: "ghost",
    speedTier: "slow",
    bulkTier: "medium",
    tags: ["defensive-backbone", "synergistic"],
    generation: 3
  },
  {
    pokemonId: 330,
    name: "Flygon",
    roles: ["Physical Sweeper", "Mixed Sweeper"],
    primaryType: "ground",
    secondaryType: "dragon",
    speedTier: "fast",
    bulkTier: "medium",
    tags: ["pivot", "hazard-remover"],
    generation: 3
  },
  {
    pokemonId: 260,
    name: "Swampert",
    roles: ["Tank", "Physical Wall"],
    primaryType: "water",
    secondaryType: "ground",
    speedTier: "slow",
    bulkTier: "high",
    tags: ["hazard-setter", "pivot", "beginner-friendly"],
    generation: 3
  },

  // Generation 4
  {
    pokemonId: 445,
    name: "Garchomp",
    roles: ["Physical Sweeper", "Tank"],
    primaryType: "ground",
    secondaryType: "dragon",
    speedTier: "fast",
    bulkTier: "high",
    tags: ["competitive-staple", "hazard-setter", "offensive-threat"],
    generation: 4
  },
  {
    pokemonId: 448,
    name: "Lucario",
    roles: ["Physical Sweeper", "Special Sweeper", "Mixed Sweeper"],
    primaryType: "fighting",
    secondaryType: "steel",
    speedTier: "average",
    bulkTier: "low",
    tags: ["priority-user", "offensive-threat"],
    generation: 4
  },
  {
    pokemonId: 472,
    name: "Gliscor",
    roles: ["Physical Wall", "Tank"],
    primaryType: "ground",
    secondaryType: "flying",
    speedTier: "average",
    bulkTier: "high",
    tags: ["hazard-setter", "defensive-backbone", "pivot"],
    generation: 4
  },
  {
    pokemonId: 479,
    name: "Rotom-Wash",
    roles: ["Mixed Wall", "Tank", "Special Sweeper"],
    primaryType: "electric",
    secondaryType: "water",
    speedTier: "average",
    bulkTier: "high",
    tags: ["pivot", "hazard-remover", "synergistic"],
    generation: 4
  },
  {
    pokemonId: 462,
    name: "Magnezone",
    roles: ["Special Sweeper", "Tank"],
    primaryType: "electric",
    secondaryType: "steel",
    speedTier: "slow",
    bulkTier: "high",
    tags: ["offensive-threat", "synergistic"],
    generation: 4
  },
  {
    pokemonId: 464,
    name: "Rhyperior",
    roles: ["Tank", "Physical Wall"],
    primaryType: "ground",
    secondaryType: "rock",
    speedTier: "very-slow",
    bulkTier: "extreme",
    tags: ["hazard-setter", "offensive-threat"],
    generation: 4
  },
  {
    pokemonId: 468,
    name: "Togekiss",
    roles: ["Special Sweeper", "Special Wall"],
    primaryType: "fairy",
    secondaryType: "flying",
    speedTier: "average",
    bulkTier: "high",
    tags: ["cleric", "versatile"],
    generation: 4
  },

  // Generation 5
  {
    pokemonId: 598,
    name: "Ferrothorn",
    roles: ["Physical Wall", "Special Wall", "Tank"],
    primaryType: "grass",
    secondaryType: "steel",
    speedTier: "very-slow",
    bulkTier: "extreme",
    tags: ["competitive-staple", "hazard-setter", "defensive-backbone"],
    generation: 5
  },
  {
    pokemonId: 635,
    name: "Hydreigon",
    roles: ["Special Sweeper"],
    primaryType: "dark",
    secondaryType: "dragon",
    speedTier: "fast",
    bulkTier: "medium",
    tags: ["offensive-threat", "pivot"],
    generation: 5
  },
  {
    pokemonId: 637,
    name: "Volcarona",
    roles: ["Special Sweeper"],
    primaryType: "bug",
    secondaryType: "fire",
    speedTier: "fast",
    bulkTier: "medium",
    tags: ["offensive-threat", "synergistic"],
    generation: 5
  },
  {
    pokemonId: 530,
    name: "Excadrill",
    roles: ["Physical Sweeper", "Tank"],
    primaryType: "ground",
    secondaryType: "steel",
    speedTier: "average",
    bulkTier: "medium",
    tags: ["hazard-remover", "hazard-setter", "offensive-threat"],
    generation: 5
  },
  {
    pokemonId: 642,
    name: "Thundurus",
    roles: ["Special Sweeper", "Mixed Sweeper"],
    primaryType: "electric",
    secondaryType: "flying",
    speedTier: "very-fast",
    bulkTier: "medium",
    tags: ["offensive-threat", "pivot"],
    generation: 5
  },
  {
    pokemonId: 645,
    name: "Landorus-Therian",
    roles: ["Physical Sweeper", "Physical Wall", "Tank"],
    primaryType: "ground",
    secondaryType: "flying",
    speedTier: "average",
    bulkTier: "high",
    tags: ["competitive-staple", "pivot", "hazard-setter"],
    generation: 5
  },
  {
    pokemonId: 591,
    name: "Amoonguss",
    roles: ["Mixed Wall", "Tank"],
    primaryType: "grass",
    secondaryType: "poison",
    speedTier: "very-slow",
    bulkTier: "high",
    tags: ["defensive-backbone", "synergistic"],
    generation: 5
  },

  // Generation 6
  {
    pokemonId: 658,
    name: "Greninja",
    roles: ["Special Sweeper", "Mixed Sweeper"],
    primaryType: "water",
    secondaryType: "dark",
    speedTier: "very-fast",
    bulkTier: "low",
    tags: ["versatile", "offensive-threat", "hazard-setter"],
    generation: 6
  },
  {
    pokemonId: 700,
    name: "Sylveon",
    roles: ["Special Wall", "Tank"],
    primaryType: "fairy",
    speedTier: "slow",
    bulkTier: "high",
    tags: ["cleric", "beginner-friendly"],
    generation: 6
  },
  {
    pokemonId: 706,
    name: "Goodra",
    roles: ["Special Wall", "Tank"],
    primaryType: "dragon",
    speedTier: "average",
    bulkTier: "high",
    tags: ["versatile", "defensive-backbone"],
    generation: 6
  },
  {
    pokemonId: 715,
    name: "Noivern",
    roles: ["Special Sweeper"],
    primaryType: "flying",
    secondaryType: "dragon",
    speedTier: "very-fast",
    bulkTier: "medium",
    tags: ["pivot", "hazard-remover"],
    generation: 6
  },
  {
    pokemonId: 713,
    name: "Avalugg",
    roles: ["Physical Wall"],
    primaryType: "ice",
    speedTier: "very-slow",
    bulkTier: "extreme",
    tags: ["hazard-remover", "defensive-backbone"],
    generation: 6
  },

  // Generation 7
  {
    pokemonId: 747,
    name: "Toxapex",
    roles: ["Physical Wall", "Special Wall", "Mixed Wall"],
    primaryType: "poison",
    secondaryType: "water",
    speedTier: "very-slow",
    bulkTier: "extreme",
    tags: ["competitive-staple", "defensive-backbone", "synergistic"],
    generation: 7
  },
  {
    pokemonId: 778,
    name: "Mimikyu",
    roles: ["Physical Sweeper"],
    primaryType: "ghost",
    secondaryType: "fairy",
    speedTier: "average",
    bulkTier: "medium",
    tags: ["offensive-threat", "priority-user"],
    generation: 7
  },
  {
    pokemonId: 784,
    name: "Kommo-o",
    roles: ["Physical Sweeper", "Special Sweeper", "Mixed Sweeper", "Tank"],
    primaryType: "dragon",
    secondaryType: "fighting",
    speedTier: "average",
    bulkTier: "high",
    tags: ["versatile", "hazard-setter"],
    generation: 7
  },
  {
    pokemonId: 785,
    name: "Tapu Koko",
    roles: ["Special Sweeper", "Mixed Sweeper"],
    primaryType: "electric",
    secondaryType: "fairy",
    speedTier: "very-fast",
    bulkTier: "medium",
    tags: ["terrain-setter", "pivot", "offensive-threat"],
    generation: 7
  },
  {
    pokemonId: 786,
    name: "Tapu Lele",
    roles: ["Special Sweeper"],
    primaryType: "psychic",
    secondaryType: "fairy",
    speedTier: "fast",
    bulkTier: "medium",
    tags: ["terrain-setter", "offensive-threat"],
    generation: 7
  },
  {
    pokemonId: 787,
    name: "Tapu Bulu",
    roles: ["Physical Sweeper", "Tank"],
    primaryType: "grass",
    secondaryType: "fairy",
    speedTier: "average",
    bulkTier: "high",
    tags: ["terrain-setter", "defensive-backbone"],
    generation: 7
  },
  {
    pokemonId: 788,
    name: "Tapu Fini",
    roles: ["Mixed Wall", "Special Wall", "Tank"],
    primaryType: "water",
    secondaryType: "fairy",
    speedTier: "average",
    bulkTier: "high",
    tags: ["terrain-setter", "hazard-remover", "defensive-backbone"],
    generation: 7
  },
  {
    pokemonId: 797,
    name: "Celesteela",
    roles: ["Mixed Wall", "Tank"],
    primaryType: "steel",
    secondaryType: "flying",
    speedTier: "slow",
    bulkTier: "high",
    tags: ["versatile", "defensive-backbone"],
    generation: 7
  },
  {
    pokemonId: 806,
    name: "Blacephalon",
    roles: ["Special Sweeper"],
    primaryType: "fire",
    secondaryType: "ghost",
    speedTier: "fast",
    bulkTier: "low",
    tags: ["offensive-threat"],
    generation: 7
  },

  // Generation 8
  {
    pokemonId: 823,
    name: "Corviknight",
    roles: ["Physical Wall", "Mixed Wall", "Tank"],
    primaryType: "steel",
    secondaryType: "flying",
    speedTier: "slow",
    bulkTier: "high",
    tags: ["pivot", "hazard-remover", "defensive-backbone"],
    generation: 8
  },
  {
    pokemonId: 865,
    name: "Sirfetch'd",
    roles: ["Physical Sweeper"],
    primaryType: "fighting",
    speedTier: "slow",
    bulkTier: "medium",
    tags: ["offensive-threat", "priority-user"],
    generation: 8
  },
  {
    pokemonId: 887,
    name: "Dragapult",
    roles: ["Special Sweeper", "Physical Sweeper", "Mixed Sweeper"],
    primaryType: "dragon",
    secondaryType: "ghost",
    speedTier: "very-fast",
    bulkTier: "medium",
    tags: ["offensive-threat", "pivot", "versatile"],
    generation: 8
  },
  {
    pokemonId: 898,
    name: "Calyrex-Shadow",
    roles: ["Special Sweeper"],
    primaryType: "psychic",
    secondaryType: "ghost",
    speedTier: "very-fast",
    bulkTier: "medium",
    tags: ["offensive-threat"],
    generation: 8
  },
  {
    pokemonId: 884,
    name: "Duraludon",
    roles: ["Special Sweeper", "Tank"],
    primaryType: "steel",
    secondaryType: "dragon",
    speedTier: "average",
    bulkTier: "high",
    tags: ["offensive-threat", "hazard-setter"],
    generation: 8
  },
  {
    pokemonId: 815,
    name: "Cinderace",
    roles: ["Physical Sweeper"],
    primaryType: "fire",
    speedTier: "very-fast",
    bulkTier: "medium",
    tags: ["pivot", "hazard-remover", "offensive-threat"],
    generation: 8
  },
  {
    pokemonId: 818,
    name: "Inteleon",
    roles: ["Special Sweeper"],
    primaryType: "water",
    speedTier: "very-fast",
    bulkTier: "low",
    tags: ["offensive-threat"],
    generation: 8
  },
  {
    pokemonId: 839,
    name: "Coalossal",
    roles: ["Tank", "Physical Wall"],
    primaryType: "rock",
    secondaryType: "fire",
    speedTier: "very-slow",
    bulkTier: "high",
    tags: ["hazard-setter", "hazard-remover"],
    generation: 8
  },

  // Generation 9
  {
    pokemonId: 1000,
    name: "Gholdengo",
    roles: ["Special Sweeper", "Tank"],
    primaryType: "steel",
    secondaryType: "ghost",
    speedTier: "average",
    bulkTier: "high",
    tags: ["competitive-staple", "synergistic", "hazard-setter"],
    generation: 9
  },
  {
    pokemonId: 984,
    name: "Great Tusk",
    roles: ["Physical Wall", "Physical Sweeper", "Tank"],
    primaryType: "ground",
    secondaryType: "fighting",
    speedTier: "average",
    bulkTier: "high",
    tags: ["competitive-staple", "hazard-setter", "hazard-remover"],
    generation: 9
  },
  {
    pokemonId: 989,
    name: "Iron Valiant",
    roles: ["Special Sweeper", "Physical Sweeper", "Mixed Sweeper"],
    primaryType: "fairy",
    secondaryType: "fighting",
    speedTier: "very-fast",
    bulkTier: "medium",
    tags: ["versatile", "offensive-threat"],
    generation: 9
  },
  {
    pokemonId: 983,
    name: "Kingambit",
    roles: ["Physical Sweeper", "Tank"],
    primaryType: "steel",
    secondaryType: "dark",
    speedTier: "slow",
    bulkTier: "high",
    tags: ["competitive-staple", "priority-user", "offensive-threat"],
    generation: 9
  },
  {
    pokemonId: 1004,
    name: "Chi-Yu",
    roles: ["Special Sweeper"],
    primaryType: "dark",
    secondaryType: "fire",
    speedTier: "fast",
    bulkTier: "medium",
    tags: ["offensive-threat"],
    generation: 9
  },
  {
    pokemonId: 987,
    name: "Flutter Mane",
    roles: ["Special Sweeper"],
    primaryType: "ghost",
    secondaryType: "fairy",
    speedTier: "very-fast",
    bulkTier: "medium",
    tags: ["offensive-threat", "competitive-staple"],
    generation: 9
  },
  {
    pokemonId: 985,
    name: "Scream Tail",
    roles: ["Mixed Wall", "Special Wall"],
    primaryType: "fairy",
    secondaryType: "psychic",
    speedTier: "fast",
    bulkTier: "high",
    tags: ["cleric", "hazard-setter", "defensive-backbone"],
    generation: 9
  },
  {
    pokemonId: 991,
    name: "Iron Bundle",
    roles: ["Special Sweeper"],
    primaryType: "ice",
    secondaryType: "water",
    speedTier: "very-fast",
    bulkTier: "medium",
    tags: ["offensive-threat"],
    generation: 9
  },
  {
    pokemonId: 911,
    name: "Skeledirge",
    roles: ["Physical Wall", "Tank"],
    primaryType: "fire",
    secondaryType: "ghost",
    speedTier: "slow",
    bulkTier: "high",
    tags: ["defensive-backbone", "offensive-threat"],
    generation: 9
  },
  {
    pokemonId: 908,
    name: "Meowscarada",
    roles: ["Physical Sweeper"],
    primaryType: "grass",
    secondaryType: "dark",
    speedTier: "very-fast",
    bulkTier: "low",
    tags: ["pivot", "priority-user", "offensive-threat"],
    generation: 9
  },
  {
    pokemonId: 930,
    name: "Garganacl",
    roles: ["Physical Wall", "Special Wall", "Tank"],
    primaryType: "rock",
    speedTier: "very-slow",
    bulkTier: "extreme",
    tags: ["defensive-backbone", "synergistic"],
    generation: 9
  },
  {
    pokemonId: 978,
    name: "Ting-Lu",
    roles: ["Physical Wall", "Special Wall", "Tank"],
    primaryType: "dark",
    secondaryType: "ground",
    speedTier: "very-slow",
    bulkTier: "extreme",
    tags: ["hazard-setter", "defensive-backbone"],
    generation: 9
  },
  {
    pokemonId: 1002,
    name: "Chien-Pao",
    roles: ["Physical Sweeper"],
    primaryType: "dark",
    secondaryType: "ice",
    speedTier: "very-fast",
    bulkTier: "medium",
    tags: ["priority-user", "offensive-threat"],
    generation: 9
  },
];

export const SCORING_WEIGHTS = {
  ADDRESSES_RECOMMENDATION: 30,
  IMPROVES_OFFENSIVE_COVERAGE: 20,
  IMPROVES_DEFENSIVE_COVERAGE: 20,
  ADDS_MISSING_ROLE: 15,
  IMPROVES_DIVERSITY: 10,
  GENERAL_SYNERGY: 5,
};

export const CONFIDENCE_THRESHOLDS = {
  HIGH: 60,
  MEDIUM: 30,
};
