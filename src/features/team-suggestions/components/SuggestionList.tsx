"use client";

import { useQuery } from "@tanstack/react-query";
import { PokedexRepository } from "@/features/pokedex/services/pokedex-repository";
import { PokemonSuggestion } from "../types/suggestion.types";
import { SuggestionCard } from "./SuggestionCard";
import { Sparkles } from "lucide-react";

interface SuggestionListProps {
  suggestions: PokemonSuggestion[];
}

export function SuggestionList({ suggestions }: SuggestionListProps) {
  const pokemonIds = suggestions.map((s) => s.pokemonId);

  const { data: pokemonDetails, isLoading } = useQuery({
    queryKey: ["suggested-pokemon-details", pokemonIds],
    queryFn: () => PokedexRepository.getPokemonByIds(pokemonIds),
    enabled: pokemonIds.length > 0,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  if (suggestions.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight">Suggested Pokémon</h2>
          <p className="text-sm text-muted-foreground">
            Recommended additions to improve your team's performance.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading
          ? Array.from({ length: suggestions.length }).map((_, i) => (
              <div key={i} className="h-32 rounded-xl border border-dashed animate-pulse bg-muted/50" />
            ))
          : suggestions.map((suggestion) => {
              const details = pokemonDetails?.find((p) => p.id === suggestion.pokemonId);
              if (!details) return null;
              return (
                <SuggestionCard
                  key={suggestion.pokemonId}
                  suggestion={suggestion}
                  details={details}
                />
              );
            })}
      </div>
    </div>
  );
}
