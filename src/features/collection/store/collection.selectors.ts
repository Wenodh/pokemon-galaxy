import { CollectionStore, PokemonId } from "../types/collection.types";
import { TOTAL_POKEMON_COUNT } from "../constants/collection.constants";

export const selectCollectionEntries = (state: CollectionStore) => state.entries;

export const selectSeenCount = (state: CollectionStore) =>
  Object.values(state.entries).filter((e) => e.seen).length;

export const selectCaughtCount = (state: CollectionStore) =>
  Object.values(state.entries).filter((e) => e.caught).length;

export const selectShinyCount = (state: CollectionStore) =>
  Object.values(state.entries).filter((e) => e.shiny).length;

export const selectAlphaCount = (state: CollectionStore) =>
  Object.values(state.entries).filter((e) => e.alpha).length;

export const selectLuckyCount = (state: CollectionStore) =>
  Object.values(state.entries).filter((e) => e.lucky).length;

export const selectCompletionPercentage = (state: CollectionStore) => {
  const caughtCount = selectCaughtCount(state);
  return Math.round((caughtCount / TOTAL_POKEMON_COUNT) * 100);
};

export const selectEntryById = (id: PokemonId) => (state: CollectionStore) =>
  state.entries[id];

export const selectActions = (state: CollectionStore) => ({
  markSeen: state.markSeen,
  markCaught: state.markCaught,
  markShiny: state.markShiny,
  markAlpha: state.markAlpha,
  markLucky: state.markLucky,
  removeFromCollection: state.removeFromCollection,
  clearCollection: state.clearCollection,
});
