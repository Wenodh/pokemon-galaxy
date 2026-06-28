import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PokemonHero } from "./pokemon-hero";

// Mock the FavoriteButton component
vi.mock("@/features/favorites/components/FavoriteButton", () => ({
  FavoriteButton: vi.fn(({ pokemonName }: any) => (
    <button data-testid="favorite-button">
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

describe("PokemonHero", () => {
  const defaultProps = {
    name: "pikachu",
    id: 25,
    image: "https://example.com/pikachu.png",
    types: ["electric"],
    genus: "Mouse Pokémon",
    generation: "generation-i",
    height: 4,
    weight: 60,
  };

  it("renders the pokemon information", () => {
    render(<PokemonHero {...defaultProps} />);

    expect(screen.getByText("pikachu")).toBeInTheDocument();
    expect(screen.getByText(/#025/)).toBeInTheDocument();
    expect(screen.getByText(/GEN I/i)).toBeInTheDocument();
    expect(screen.getByText("electric")).toBeInTheDocument();
    expect(screen.getByText("Mouse Pokémon")).toBeInTheDocument();
    expect(screen.getByText("0.4m")).toBeInTheDocument();
    expect(screen.getByText("6.0kg")).toBeInTheDocument();
  });

  it("contains the FavoriteButton", () => {
    render(<PokemonHero {...defaultProps} />);

    expect(screen.getByTestId("favorite-button")).toBeInTheDocument();
  });
});
