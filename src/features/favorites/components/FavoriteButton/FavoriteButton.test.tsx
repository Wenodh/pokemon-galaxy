import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FavoriteButton } from "./FavoriteButton";
import { useIsFavorite } from "../../hooks/useIsFavorite";
import { useFavoriteActions } from "../../hooks/useFavoriteActions";

// Mock the hooks
vi.mock("../../hooks/useIsFavorite", () => ({
  useIsFavorite: vi.fn(),
}));

vi.mock("../../hooks/useFavoriteActions", () => ({
  useFavoriteActions: vi.fn(),
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    button: ({ children, whileHover, whileTap, transition, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
  },
  useReducedMotion: vi.fn(() => false),
}));

describe("FavoriteButton", () => {
  const mockToggle = vi.fn();
  const defaultProps = {
    pokemonId: 25,
    pokemonName: "Pikachu",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useFavoriteActions as any).mockReturnValue({ toggle: mockToggle });
  });

  it("renders correctly in non-favorited state", () => {
    (useIsFavorite as any).mockReturnValue(false);
    render(<FavoriteButton {...defaultProps} />);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", "Add Pikachu to favorites");
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(button).not.toHaveAttribute("disabled");
  });

  it("renders correctly in favorited state", () => {
    (useIsFavorite as any).mockReturnValue(true);
    render(<FavoriteButton {...defaultProps} />);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", "Remove Pikachu from favorites");
    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  it("calls toggle when clicked", () => {
    (useIsFavorite as any).mockReturnValue(false);
    render(<FavoriteButton {...defaultProps} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockToggle).toHaveBeenCalledWith(25);
  });

  it("shows loading state and is disabled", () => {
    (useIsFavorite as any).mockReturnValue(false);
    render(<FavoriteButton {...defaultProps} isLoading />);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("is disabled when disabled prop is true", () => {
    (useIsFavorite as any).mockReturnValue(false);
    render(<FavoriteButton {...defaultProps} disabled />);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("applies variant classes correctly", () => {
    (useIsFavorite as any).mockReturnValue(false);
    const { rerender } = render(<FavoriteButton {...defaultProps} variant="filled" />);
    expect(screen.getByRole("button")).toHaveClass("bg-primary");

    rerender(<FavoriteButton {...defaultProps} variant="subtle" />);
    expect(screen.getByRole("button")).toHaveClass("bg-muted/50");
  });

  it("applies size classes correctly", () => {
    (useIsFavorite as any).mockReturnValue(false);
    const { rerender } = render(<FavoriteButton {...defaultProps} size="xs" />);
    expect(screen.getByRole("button")).toHaveClass("h-7 w-7");

    rerender(<FavoriteButton {...defaultProps} size="lg" />);
    expect(screen.getByRole("button")).toHaveClass("h-12 w-12");
  });
});
