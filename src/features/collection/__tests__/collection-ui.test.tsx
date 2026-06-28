import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CollectionControls } from "../components/collection-controls";
import { useCollectionStatus } from "../hooks/useCollectionStatus";
import { useCollectionActions } from "../hooks/useCollectionActions";

// Mock hooks
vi.mock("../hooks/useCollectionStatus");
vi.mock("../hooks/useCollectionActions");

describe("CollectionControls", () => {
  const mockMarkSeen = vi.fn();
  const mockMarkCaught = vi.fn();
  const mockMarkShiny = vi.fn();
  const mockRemoveFromCollection = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useCollectionActions as any).mockReturnValue({
      markSeen: mockMarkSeen,
      markCaught: mockMarkCaught,
      markShiny: mockMarkShiny,
      removeFromCollection: mockRemoveFromCollection,
    });
  });

  it("renders correctly with initial state", () => {
    (useCollectionStatus as any).mockReturnValue({
      isSeen: false,
      isCaught: false,
      isShiny: false,
    });

    render(<CollectionControls pokemonId={1} />);

    expect(screen.getByText("Seen")).toBeInTheDocument();
    expect(screen.getByText("Caught")).toBeInTheDocument();
    expect(screen.getByText("Shiny")).toBeInTheDocument();
  });

  it("calls markSeen when clicking Seen button", () => {
    (useCollectionStatus as any).mockReturnValue({
      isSeen: false,
      isCaught: false,
      isShiny: false,
    });

    render(<CollectionControls pokemonId={1} />);
    fireEvent.click(screen.getByText("Seen"));

    expect(mockMarkSeen).toHaveBeenCalledWith(1);
  });

  it("calls removeFromCollection when untoggling Seen if no other status is active", () => {
    (useCollectionStatus as any).mockReturnValue({
      isSeen: true,
      isCaught: false,
      isShiny: false,
    });

    render(<CollectionControls pokemonId={1} />);
    fireEvent.click(screen.getByText("Seen"));

    expect(mockRemoveFromCollection).toHaveBeenCalledWith(1);
  });

  it("calls markCaught when clicking Caught button", () => {
    (useCollectionStatus as any).mockReturnValue({
      isSeen: true,
      isCaught: false,
      isShiny: false,
    });

    render(<CollectionControls pokemonId={1} />);
    fireEvent.click(screen.getByText("Caught"));

    expect(mockMarkCaught).toHaveBeenCalledWith(1, true);
  });

  it("calls markShiny when clicking Shiny button", () => {
    (useCollectionStatus as any).mockReturnValue({
      isSeen: true,
      isCaught: true,
      isShiny: false,
    });

    render(<CollectionControls pokemonId={1} />);
    fireEvent.click(screen.getByText("Shiny"));

    expect(mockMarkShiny).toHaveBeenCalledWith(1, true);
  });
});
