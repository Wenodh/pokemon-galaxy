import { describe, it, expect, beforeEach, vi } from "vitest";
import { useTrainerStore } from "../store/trainer.store";
import { TrainerStatisticsService } from "../application/statistics-service";
import { TrainerEventService } from "../application/event-service";

describe("Trainer Profile & Achievement Engine tests", () => {
  beforeEach(() => {
    useTrainerStore.getState().clearProfile();
  });

  it("should initialize with default profile values", () => {
    const { profile, timeline } = useTrainerStore.getState();
    expect(profile.name).toBe("Red");
    expect(profile.avatarStyle).toBe("initials");
    expect(profile.completedMilestones.length).toBe(0);
    expect(Object.keys(profile.completedAchievements).length).toBe(0);
    expect(timeline.length).toBe(0);
  });

  it("should allow editing profile customization", () => {
    const store = useTrainerStore.getState();
    store.updateProfile({
      name: "Ash",
      avatarStyle: "pixel",
      avatarColor: "bg-blue-500",
      favoritePokemonId: 25,
      favoriteType: "Electric",
    });

    const updated = useTrainerStore.getState().profile;
    expect(updated.name).toBe("Ash");
    expect(updated.avatarStyle).toBe("pixel");
    expect(updated.avatarColor).toBe("bg-blue-500");
    expect(updated.favoritePokemonId).toBe(25);
    expect(updated.favoriteType).toBe("Electric");
  });

  it("should push timeline events correctly", () => {
    const store = useTrainerStore.getState();
    store.addTimelineEvent(
      "COLLECTION_CREATED",
      "Kanto Starters Created",
      "Organized your favorite initial companions."
    );

    const timeline = useTrainerStore.getState().timeline;
    expect(timeline.length).toBe(1);
    expect(timeline[0].title).toBe("Kanto Starters Created");
    expect(timeline[0].type).toBe("COLLECTION_CREATED");
  });

  it("should evaluate and unlock achievements automatically", () => {
    const spy = vi.spyOn(TrainerStatisticsService, "getStatistics").mockReturnValue({
      pokemonSeen: 1,
      pokemonCaught: 1, // Target of 'first-catch' is 1
      livingDexCompletion: 0.1,
      collectionsCreated: 0,
      pokemonInCollections: 0,
      teamsCreated: 0,
      favoritesCount: 0,
      viewedPokemon: 0,
      exportedCollections: 0,
      importedCollections: 0,
      teamAnalyses: 0,
    });

    const store = useTrainerStore.getState();
    store.evaluateProgress("pokemonCaught");

    const updated = useTrainerStore.getState().profile;
    const timeline = useTrainerStore.getState().timeline;

    expect(updated.completedAchievements["first-catch"]).toBeDefined();

    // Check timeline matches unlock
    const unlockEvent = timeline.find((e) => e.type === "ACHIEVEMENT_UNLOCKED");
    expect(unlockEvent).toBeDefined();
    expect(unlockEvent?.title).toContain('Unlocked "First Steps"');

    spy.mockRestore();
  });

  it("should evaluate and unlock milestones based on Living Dex percentage", () => {
    const spy = vi.spyOn(TrainerStatisticsService, "getStatistics").mockReturnValue({
      pokemonSeen: 120,
      pokemonCaught: 110,
      livingDexCompletion: 10.7, // Reached 10.7% completion
      collectionsCreated: 2,
      pokemonInCollections: 7,
      teamsCreated: 2,
      favoritesCount: 4,
      viewedPokemon: 15,
      exportedCollections: 2,
      importedCollections: 3,
      teamAnalyses: 4,
    });

    const store = useTrainerStore.getState();
    store.evaluateProgress("pokemonCaught");

    const updated = useTrainerStore.getState().profile;
    const timeline = useTrainerStore.getState().timeline;

    // Reached 10.7% completion, so 10% milestone should trigger!
    expect(updated.completedMilestones).toContain(10);

    const milestoneEvent = timeline.find((e) => e.type === "MILESTONE_REACHED");
    expect(milestoneEvent).toBeDefined();
    expect(milestoneEvent?.title).toBe("10% Living Dex Completed");

    spy.mockRestore();
  });

  it("should receive events from the Favorites Store on additions and removals", async () => {
    const receivedEvents: any[] = [];
    const unsubscribe = TrainerEventService.subscribe((event) => {
      receivedEvents.push(event);
    });

    const { useFavoritesStore } = await import("../../favorites/store/favorites.store");
    useFavoritesStore.getState().clearFavorites();

    useFavoritesStore.getState().addFavorite(25, "Pikachu");

    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(receivedEvents.length).toBe(1);
    expect(receivedEvents[0]).toEqual({
      type: "FAVORITE_ADDED",
      id: 25,
      name: "Pikachu",
    });

    useFavoritesStore.getState().removeFavorite(25, "Pikachu");
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(receivedEvents.length).toBe(2);
    expect(receivedEvents[1]).toEqual({
      type: "FAVORITE_REMOVED",
      id: 25,
      name: "Pikachu",
    });

    unsubscribe();
  });

  it("should receive events from Team Store when team operations occur", async () => {
    const receivedEvents: any[] = [];
    const unsubscribe = TrainerEventService.subscribe((event) => {
      receivedEvents.push(event);
    });

    const { useTeamStore } = await import("../../team/store/team.store");

    const uniqueTeamName = `My Testing Team ${crypto.randomUUID()}`;
    const result = useTeamStore.getState().createTeam(uniqueTeamName);
    expect(result.ok).toBe(true);

    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(receivedEvents.some(e => e.type === "TEAM_CREATED" && e.name === uniqueTeamName)).toBe(true);

    const teamId = (result as any).value;
    const dupResult = useTeamStore.getState().duplicateTeam(teamId);
    expect(dupResult.ok).toBe(true);
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(receivedEvents.some(e => e.type === "TEAM_DUPLICATED")).toBe(true);

    const importResult = useTeamStore.getState().createTeam("Imported Squad", true);
    expect(importResult.ok).toBe(true);
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(receivedEvents.some(e => e.type === "TEAM_IMPORTED")).toBe(true);

    unsubscribe();
  });

  it("should receive events from Living Dex Store when marking seen and caught", async () => {
    const receivedEvents: any[] = [];
    const unsubscribe = TrainerEventService.subscribe((event) => {
      receivedEvents.push(event);
    });

    const { useLivingDexStore } = await import("../../collections/store/living-dex.store");
    useLivingDexStore.getState().clearLivingDex();

    useLivingDexStore.getState().markSeen(1, true, "Bulbasaur");
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(receivedEvents.some(e => e.type === "POKEMON_SEEN" && e.id === 1 && e.name === "Bulbasaur")).toBe(true);

    useLivingDexStore.getState().markCaught(4, true, "Charmander");
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(receivedEvents.some(e => e.type === "POKEMON_CAUGHT" && e.id === 4 && e.name === "Charmander")).toBe(true);

    unsubscribe();
  });
});
