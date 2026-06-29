import { describe, it, expect, beforeEach } from "vitest";
import { useSavedViewStore } from "../store/saved-views.store";
import { SortConfig } from "@/features/search/sort";

// Mock crypto.randomUUID
if (!global.crypto) {
  (global as any).crypto = {
    randomUUID: () => Math.random().toString(36).substring(2),
  };
}

describe("SavedViewStore", () => {
  beforeEach(() => {
    useSavedViewStore.getState().applyView(null);
    const { views, viewIds } = useSavedViewStore.getState();
    viewIds.forEach(id => useSavedViewStore.getState().deleteView(id));
  });

  const defaultSort: SortConfig = { field: "id", direction: "asc" };

  it("should save a new view", () => {
    const { saveView } = useSavedViewStore.getState();
    const result = saveView({
      name: "Test View",
      search: "pikachu",
      sort: defaultSort,
    });

    expect(result.success).toBe(true);
    const { views, viewIds } = useSavedViewStore.getState();
    expect(viewIds.length).toBe(1);
    const savedView = views[viewIds[0]];
    expect(savedView.name).toBe("Test View");
    expect(savedView.search).toBe("pikachu");
  });

  it("should prevent duplicate names (case-insensitive)", () => {
    const { saveView } = useSavedViewStore.getState();
    saveView({ name: "Fire", search: "", sort: defaultSort });

    const result = saveView({ name: "fire", search: "", sort: defaultSort });
    expect(result.success).toBe(false);
    expect(result.error).toBe("A view with this name already exists");
  });

  it("should prevent empty names", () => {
    const { saveView } = useSavedViewStore.getState();
    const result = saveView({ name: "   ", search: "", sort: defaultSort });
    expect(result.success).toBe(false);
    expect(result.error).toBe("Name cannot be empty");
  });

  it("should prevent excessively long names", () => {
    const { saveView } = useSavedViewStore.getState();
    const result = saveView({ name: "a".repeat(41), search: "", sort: defaultSort });
    expect(result.success).toBe(false);
    expect(result.error).toContain("cannot exceed 40 characters");
  });

  it("should delete a view", () => {
    const { saveView, deleteView } = useSavedViewStore.getState();
    saveView({ name: "To Delete", search: "", sort: defaultSort });
    const id = useSavedViewStore.getState().viewIds[0];

    deleteView(id);
    expect(useSavedViewStore.getState().viewIds.length).toBe(0);
    expect(useSavedViewStore.getState().views[id]).toBeUndefined();
  });

  it("should duplicate a view", () => {
    const { saveView, duplicateView } = useSavedViewStore.getState();
    saveView({ name: "Original", search: "pika", sort: defaultSort });
    const id = useSavedViewStore.getState().viewIds[0];

    duplicateView(id);
    const { views, viewIds } = useSavedViewStore.getState();
    expect(viewIds.length).toBe(2);
    const duplicatedId = viewIds.find(vid => vid !== id);
    expect(views[duplicatedId!].name).toBe("Original (Copy)");
    expect(views[duplicatedId!].search).toBe("pika");
  });

  it("should rename a view", () => {
    const { saveView, renameView } = useSavedViewStore.getState();
    saveView({ name: "Old Name", search: "", sort: defaultSort });
    const id = useSavedViewStore.getState().viewIds[0];

    const result = renameView(id, "New Name");
    expect(result.success).toBe(true);
    expect(useSavedViewStore.getState().views[id].name).toBe("New Name");
  });
});
