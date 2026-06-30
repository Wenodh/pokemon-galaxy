"use client";

import { useQuery } from "@tanstack/react-query";
import { PokedexRepository } from "@/features/pokedex/services/pokedex-repository";
import { useActiveTeam } from "./useActiveTeam";
import { useMemo } from "react";

export const useTeamPokemon = () => {
  const { activeTeam } = useActiveTeam();
  const pokemonIds = activeTeam?.pokemon || [];

  const { data: pokemonDetails, isLoading, isError } = useQuery({
    queryKey: ["team-pokemon", pokemonIds],
    queryFn: () => PokedexRepository.getPokemonByIds(pokemonIds),
    enabled: pokemonIds.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const fullTeam = useMemo(() => {
    if (!activeTeam) return null;

    // Map the fetched Pokémon details back to the IDs in the team order
    // to preserve the team's custom order (if any)
    const pokemonMap = new Map((pokemonDetails || []).map(p => [p.id, p]));

    const pokemonList = activeTeam.pokemon.map(id => pokemonMap.get(id)).filter(Boolean);

    return {
      ...activeTeam,
      pokemonDetails: pokemonList
    };
  }, [activeTeam, pokemonDetails]);

  return {
    team: fullTeam,
    isLoading: pokemonIds.length > 0 && isLoading,
    isError,
  };
};
