import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CollectionPageContent } from "../components/collection-page-content";
import { useCollectionStore } from "../store/collection.store";
import { useCollectionPokemon } from "../hooks/use-collection-pokemon";
import { useRouter } from "next/navigation";

// Mock dependencies
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("../../hooks/use-collection-pokemon", () => ({
  useCollectionPokemon: vi.fn(),
}));

// Mock feature hooks that might cause issues in unit tests
vi.mock("@/features/saved-views", () => ({
  useSavedViewActions: () => ({ applyView: vi.fn() }),
  useSavedViews: () => ({ views: [], activeViewId: null, activeView: null }),
}));

describe("CollectionPageContent", () => {
  const mockRouter = { push: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue(mockRouter);
    // Default mock implementation for useCollectionPokemon
    (useCollectionPokemon as any).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });
  });

  it("renders empty state when collection is empty", () => {
    // Clear the store
    useCollectionStore.getState().clearCollection();

    render(<CollectionPageContent />);

    expect(screen.getByText(/Collection is empty/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Explore Pokédex/i })).toBeInTheDocument();
  });

  it("navigates to pokedex from empty state", async () => {
    useCollectionStore.getState().clearCollection();
    render(<CollectionPageContent />);

    const button = screen.getByRole("button", { name: /Explore Pokédex/i });
    button.click();

    expect(mockRouter.push).toHaveBeenCalledWith("/pokedex");
  });

  it("renders loading state when fetching pokemon", () => {
    // Add something to collection to trigger detail fetch
    useCollectionStore.getState().markCaught(1);

    (useCollectionPokemon as any).mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
    });

    render(<CollectionPageContent />);

    // Should show skeletons (can check by data-testid or just presence of loading indicator if added)
    // For now, checking that empty state isn't there
    expect(screen.queryByText(/Collection is empty/i)).not.toBeInTheDocument();
  });
});
