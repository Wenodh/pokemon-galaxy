import { useLivingDexStore } from "../../collections/store/living-dex.store";
import { useCollectionsStore } from "../../collections/store/collections.store";
import { useFavoritesStore } from "../../favorites/store/favorites.store";
import { useTeamStore } from "../../team/store/team.store";
import { TrainerStatistics } from "../types";

export class TrainerStatisticsService {
  public static getStatistics(
    viewedPokemonCount: number = 0,
    exportedCount: number = 0,
    importedCount: number = 0,
    teamAnalysesCount: number = 0
  ): TrainerStatistics {
    const livingDexState = useLivingDexStore.getState() as any;

    let caughtSet = new Set<number>();
    let seenSet = new Set<number>();

    if (livingDexState.entries) {
      const entries = Object.values(livingDexState.entries || {});
      entries.forEach((e: any) => {
        if (e.caught) caughtSet.add(e.pokemonId);
        if (e.seen) seenSet.add(e.pokemonId);
      });
    }

    if (Array.isArray(livingDexState.caughtPokemon)) {
      livingDexState.caughtPokemon.forEach((id: number) => caughtSet.add(id));
    }
    if (Array.isArray(livingDexState.seenPokemon)) {
      livingDexState.seenPokemon.forEach((id: number) => seenSet.add(id));
    }

    const totalSeenUnique = new Set([...seenSet, ...caughtSet]);

    const pokemonSeen = totalSeenUnique.size;
    const pokemonCaught = caughtSet.size;

    const totalNationalCount = 1025;
    const livingDexCompletion = totalNationalCount > 0
      ? Math.round((pokemonCaught / totalNationalCount) * 100 * 10) / 10
      : 0;

    const collectionsState = useCollectionsStore.getState();
    const collectionsList = Object.values(collectionsState.collections || {});
    const collectionsCreated = collectionsList.length;

    const pokemonInCollections = collectionsList.reduce(
      (sum, col) => sum + (col.pokemonIds?.length || 0),
      0
    );

    const favoritesState = useFavoritesStore.getState();
    const favoritesCount = Array.isArray(favoritesState.favorites)
      ? favoritesState.favorites.length
      : 0;

    const teamState = useTeamStore.getState();
    const teamsCreated = Array.isArray(teamState.teamOrder)
      ? teamState.teamOrder.length
      : 0;

    return {
      pokemonSeen,
      pokemonCaught,
      livingDexCompletion,
      collectionsCreated,
      pokemonInCollections,
      teamsCreated,
      teamAnalyses: teamAnalysesCount,
      favoritesCount,
      viewedPokemon: viewedPokemonCount,
      exportedCollections: exportedCount,
      importedCollections: importedCount,
    };
  }
}
