export const COLLECTIONS_STORAGE_KEY = "pokemon-collections-storage";
export const COLLECTIONS_STORE_VERSION = 1;

export const LIVING_DEX_STORAGE_KEY = "pokemon-living-dex-storage";
export const LIVING_DEX_STORE_VERSION = 1;

export const TOTAL_POKEMON_COUNT = 1025;

export const legendaryIds = new Set<number>([
  144, 145, 146, 150, // Gen 1
  243, 244, 245, 249, 250, // Gen 2
  377, 378, 379, 380, 381, 382, 383, 384, // Gen 3
  480, 481, 482, 483, 484, 485, 486, 487, 488, // Gen 4
  638, 639, 640, 641, 642, 643, 644, 645, 646, // Gen 5
  716, 717, 718, // Gen 6
  772, 773, 785, 786, 787, 788, 789, 790, 791, 792, 800, // Gen 7
  888, 889, 890, 891, 892, 894, 895, 896, 897, 898, 905, // Gen 8
  1001, 1002, 1003, 1004, 1007, 1008, 1014, 1015, 1016, 1017, 1024 // Gen 9
]);

export const mythicalIds = new Set<number>([
  151, // Gen 1
  251, // Gen 2
  385, 386, // Gen 3
  489, 490, 491, 492, 493, // Gen 4
  494, 647, 648, 649, // Gen 5
  719, 720, 721, // Gen 6
  801, 802, 807, 808, 809, // Gen 7
  893, // Gen 8
  1025 // Gen 9
]);

export const ultraBeastIds = new Set<number>([
  793, 794, 795, 796, 797, 798, 799, 803, 804, 805, 806
]);

export const paradoxIds = new Set<number>([
  984, 985, 986, 987, 988, 989, 990, 991, 992, 993, 994, 995, 1005, 1006, 1009, 1010, 1020, 1021, 1022, 1023
]);

export interface GenerationRange {
  id: number;
  name: string;
  startId: number;
  endId: number;
}

export const GENERATIONS: GenerationRange[] = [
  { id: 1, name: "Generation I", startId: 1, endId: 151 },
  { id: 2, name: "Generation II", startId: 152, endId: 251 },
  { id: 3, name: "Generation III", startId: 252, endId: 386 },
  { id: 4, name: "Generation IV", startId: 387, endId: 493 },
  { id: 5, name: "Generation V", startId: 494, endId: 649 },
  { id: 6, name: "Generation VI", startId: 650, endId: 721 },
  { id: 7, name: "Generation VII", startId: 722, endId: 809 },
  { id: 8, name: "Generation VIII", startId: 810, endId: 898 },
  { id: 9, name: "Generation IX", startId: 899, endId: 1025 },
];

export const POKEMON_TYPES = [
  "normal", "fire", "water", "grass", "electric", "ice",
  "fighting", "poison", "ground", "flying", "psychic", "bug",
  "rock", "ghost", "dragon", "dark", "steel", "fairy"
];
