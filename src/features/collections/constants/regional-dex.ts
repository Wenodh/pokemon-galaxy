export interface DexDefinition {
  id: string;
  name: string;
  pokemonIds: number[];
}

const range = (start: number, end: number): number[] => {
  const arr: number[] = [];
  for (let i = start; i <= end; i++) {
    arr.push(i);
  }
  return arr;
};

export const REGIONAL_DEXES: DexDefinition[] = [
  {
    id: "national",
    name: "National Pokédex",
    pokemonIds: range(1, 1025),
  },
  {
    id: "kanto",
    name: "Kanto Pokédex",
    pokemonIds: range(1, 151),
  },
  {
    id: "johto",
    name: "Johto Pokédex",
    pokemonIds: range(152, 251),
  },
  {
    id: "hoenn",
    name: "Hoenn Pokédex",
    pokemonIds: range(252, 386),
  },
  {
    id: "sinnoh",
    name: "Sinnoh Pokédex",
    pokemonIds: range(387, 493),
  },
  {
    id: "unova",
    name: "Unova Pokédex",
    pokemonIds: range(494, 649),
  },
  {
    id: "kalos",
    name: "Kalos Pokédex",
    pokemonIds: range(650, 721),
  },
  {
    id: "alola",
    name: "Alola Pokédex",
    pokemonIds: range(722, 809),
  },
  {
    id: "galar",
    name: "Galar Pokédex",
    pokemonIds: range(810, 898),
  },
  {
    id: "paldea",
    name: "Paldea Pokédex",
    pokemonIds: range(899, 1025),
  },
];
