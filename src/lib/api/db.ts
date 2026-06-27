import Dexie, { Table } from 'dexie';

export interface CollectionItem {
  id: number;
  name: string;
  status: 'owned' | 'favorite' | 'seen' | 'want';
  addedAt: number;
}

export interface Team {
  id?: number;
  name: string;
  pokemonIds: number[]; // Array of up to 6 pokemon IDs
  createdAt: number;
}

export class PokemonGalaxyDatabase extends Dexie {
  collection!: Table<CollectionItem>;
  teams!: Table<Team>;

  constructor() {
    super('PokemonGalaxyDB');
    this.version(1).stores({
      collection: 'id, name, status',
      teams: '++id, name'
    });
  }
}

export const db = new PokemonGalaxyDatabase();
