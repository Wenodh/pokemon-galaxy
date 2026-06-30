import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PokemonCard } from "./pokemon-card";
import { PokemonListItem } from "../types";

// Mock the FavoriteButton component
vi.mock("@/features/favorites/components/FavoriteButton", () => ({
  FavoriteButton: vi.fn(({ pokemonName }) => (
    <button data-testid="favorite-button">
      Favorite {pokemonName}
    </button>
  )),
}));

// Mock CollectionBadges
vi.mock("@/features/collection/components/collection-badges", () => ({
  CollectionBadges: () => <div data-testid="collection-badges" />,
}));

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, whileHover, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock hooks
const mockAddPokemon = vi.fn().mockReturnValue({ ok: true });
vi.mock("@/features/team/hooks/useActiveTeam", () => ({
  useActiveTeam: () => ({
    activeTeam: { id: "1", name: "Test Team" },
    addPokemon: mockAddPokemon,
  }),
}));

vi.mock("@/features/team/hooks/useTeams", () => ({
  useTeams: () => ({
    teams: [{ id: "1", name: "Test Team" }],
  }),
}));

describe("PokemonCard", () => {
  const mockPokemon: PokemonListItem = {
    id: 1,
    name: "bulbasaur",
    image: "https://example.com/bulbasaur.png",
    types: ["grass", "poison"],
  };

  it("renders the pokemon information", () => {
    render(<PokemonCard pokemon={mockPokemon} />);

    expect(screen.getByText("bulbasaur")).toBeInTheDocument();
    expect(screen.getByText("#0001")).toBeInTheDocument();
    expect(screen.getByText("grass")).toBeInTheDocument();
    expect(screen.getByText("poison")).toBeInTheDocument();
  });

  it("links to the pokemon details page", () => {
    render(<PokemonCard pokemon={mockPokemon} />);

    const link = screen.getByRole("link", { name: /view details for bulbasaur/i });
    expect(link).toHaveAttribute("href", "/pokemon/bulbasaur");
  });

  it("contains the FavoriteButton", () => {
    render(<PokemonCard pokemon={mockPokemon} />);

    expect(screen.getByTestId("favorite-button")).toBeInTheDocument();
  });

  it("renders Add button in team-builder mode and handles click", () => {
    render(<PokemonCard pokemon={mockPokemon} mode="team-builder" />);

    const addButton = screen.getByRole("button", { name: /add bulbasaur to active team/i });
    expect(addButton).toBeInTheDocument();

    // Verify it has z-10 for the fix
    expect(addButton.parentElement).toHaveClass("z-10");

    addButton.click();
    expect(mockAddPokemon).toHaveBeenCalledWith("1", 1);
  });
});
