import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PokemonCard } from "./pokemon-card";
import { PokemonListItem } from "../types";

// Mock the FavoriteButton component
vi.mock("@/features/favorites/components/FavoriteButton", () => ({
  FavoriteButton: vi.fn(({ pokemonName, onClick }: any) => (
    <button
      data-testid="favorite-button"
      onClick={(e) => {
        if (onClick) onClick(e);
        // Simulate FavoriteButton's stopPropagation
        e.stopPropagation();
      }}
    >
      Favorite {pokemonName}
    </button>
  )),
}));

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
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
    expect(screen.getByText("#001")).toBeInTheDocument();
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
});
