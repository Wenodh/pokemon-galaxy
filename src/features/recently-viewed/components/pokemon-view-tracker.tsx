"use client";

import { useEffect } from "react";
import { useRecentlyViewedActions } from "../hooks/useRecentlyViewedActions";

interface PokemonViewTrackerProps {
  pokemonId: number;
}

/**
 * Client-side component that tracks a Pokémon visit.
 * Has no UI and runs once on mount.
 */
export function PokemonViewTracker({ pokemonId }: PokemonViewTrackerProps) {
  const { addRecent } = useRecentlyViewedActions();

  useEffect(() => {
    if (pokemonId > 0) {
      addRecent(pokemonId);
    }
  }, [pokemonId, addRecent]);

  return null;
}
