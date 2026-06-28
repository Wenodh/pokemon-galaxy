export type FavoriteButtonSize = "xs" | "sm" | "md" | "lg";
export type FavoriteButtonVariant = "ghost" | "subtle" | "filled";

export interface FavoriteButtonProps {
  /**
   * The ID of the Pokémon to favorite/unfavorite.
   */
  pokemonId: number;

  /**
   * The name of the Pokémon for accessibility labels.
   */
  pokemonName: string;

  /**
   * Visual size of the button.
   * @default "md"
   */
  size?: FavoriteButtonSize;

  /**
   * Visual style of the button.
   * @default "ghost"
   */
  variant?: FavoriteButtonVariant;

  /**
   * Whether the button is in a loading state.
   * Disables interaction and shows a loading indicator.
   */
  isLoading?: boolean;

  /**
   * Whether the button is disabled.
   */
  disabled?: boolean;

  /**
   * Additional CSS classes.
   */
  className?: string;
}
