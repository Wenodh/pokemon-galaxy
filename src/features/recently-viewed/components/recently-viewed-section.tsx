"use client";

import Link from "next/link";
import { ArrowRight, History } from "lucide-react";
import { Section } from "@/components/common/section";
import { Container } from "@/components/common/container";
import { PokemonGrid } from "@/features/pokedex/components/pokemon-grid";
import { PokemonCard } from "@/features/pokedex/components/pokemon-card";
import { PokemonSkeletonGrid } from "@/features/pokedex/components/pokemon-skeleton";
import { useRecentlyViewed } from "../hooks/useRecentlyViewed";
import { useFavoritePokemon } from "@/features/favorites/hooks/use-favorite-pokemon";
import { HOME_RECENT_ITEMS_LIMIT } from "../constants/recently-viewed.constants";
import * as React from "react";

export function RecentlyViewedSection() {
  const { recentIds, recentCount } = useRecentlyViewed();

  // Only show top N items on home page
  const homeIds = React.useMemo(() => recentIds.slice(0, HOME_RECENT_ITEMS_LIMIT), [recentIds]);

  const { data: pokemon, isLoading } = useFavoritePokemon(homeIds);

  // Preserve recency order from recentIds
  const orderedPokemon = React.useMemo(() => {
    if (!pokemon) return [];
    return homeIds
      .map(id => pokemon.find(p => p.id === id))
      .filter((p): p is NonNullable<typeof p> => !!p);
  }, [pokemon, homeIds]);

  if (recentCount === 0) return null;

  return (
    <Section className="border-t border-border/50">
      <Container>
        <div className="flex items-end justify-between mb-12">
          <div className="flex items-center gap-3">
             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <History className="h-6 w-6" />
             </div>
             <div>
                <h2 className="text-3xl font-bold tracking-tight">
                    Recently Viewed
                </h2>
                <p className="mt-1 text-muted-foreground">
                    Continue your journey where you left off.
                </p>
             </div>
          </div>
          <Link
            href="/recent"
            className="group hidden items-center text-sm font-medium text-primary md:flex"
          >
            View history
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {isLoading ? (
          <PokemonSkeletonGrid count={Math.min(recentCount, HOME_RECENT_ITEMS_LIMIT)} />
        ) : (
          <PokemonGrid>
            {orderedPokemon.map((p) => (
              <PokemonCard key={p.id} pokemon={p} />
            ))}
          </PokemonGrid>
        )}
      </Container>
    </Section>
  );
}
