"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  SearchX,
  LayoutGrid,
  StretchHorizontal,
  History,
  Trash2
} from "lucide-react";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/page-header";
import { ErrorMessage } from "@/components/common/error-message";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/common/search-input";
import { PokemonGrid } from "@/features/pokedex/components/pokemon-grid";
import { PokemonCard } from "@/features/pokedex/components/pokemon-card";
import { PokemonSkeletonGrid } from "@/features/pokedex/components/pokemon-skeleton";
import { useRecentlyViewed } from "../hooks/useRecentlyViewed";
import { useRecentlyViewedActions } from "../hooks/useRecentlyViewedActions";
import { useFavoritePokemon } from "@/features/favorites/hooks/use-favorite-pokemon";
import { useUserPreferencesStore } from "@/store/user-preferences-store";
import { filterPokemon } from "@/features/favorites/utils/favorites.sorting";

export function RecentlyViewedPageContent() {
  const router = useRouter();
  const { recentIds, recentCount } = useRecentlyViewed();
  const { clearHistory } = useRecentlyViewedActions();
  const { cardDensity, setCardDensity } = useUserPreferencesStore();

  const [searchQuery, setSearchQuery] = React.useState("");

  const { data: pokemonDetails, isLoading, isError, error, refetch } = useFavoritePokemon(recentIds);

  const filteredAndOrderedPokemon = React.useMemo(() => {
    if (!pokemonDetails) return [];

    // First filter by current recentIds to handle instant removal/clearing
    const currentDetails = recentIds
      .map(id => pokemonDetails.find(p => p.id === id))
      .filter((p): p is NonNullable<typeof p> => !!p);

    // Then filter by search
    return filterPokemon(currentDetails, searchQuery);
  }, [pokemonDetails, recentIds, searchQuery]);

  if (recentIds.length === 0) {
    return (
      <Container>
        <PageHeader
          title="Recently Viewed"
          description="Your browsing history across the galaxy."
        />
        <div className="py-20">
          <EmptyState
            title="No recently viewed Pokémon yet"
            description="Start exploring the Pokédex to see your history here."
            icon={<History className="h-12 w-12 text-muted-foreground/40" />}
          >
            <Button onClick={() => router.push("/pokedex")}>
              Explore Pokémon
            </Button>
          </EmptyState>
        </div>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container>
        <PageHeader
          title="Recently Viewed"
          description="Your browsing history across the galaxy."
        />
        <div className="py-12">
          <ErrorMessage
            message={error?.message || "Failed to load history. Please try again."}
            onRetry={() => refetch()}
          />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <PageHeader
          title="Recently Viewed"
          description="Your browsing history across the galaxy."
          className="mb-0"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={clearHistory}
          className="text-muted-foreground hover:text-destructive self-start sm:self-auto"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Clear History
        </Button>
      </div>

      <div className="space-y-8 pb-20">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
            <SearchInput
              placeholder="Search history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-[300px]"
            />
            <p className="text-sm text-muted-foreground">
               {recentCount} Pokémon in history
            </p>
          </div>

          <div className="flex items-center gap-1 rounded-md border border-border/50 bg-card/30 p-1">
            <Button
              variant={cardDensity === "comfortable" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setCardDensity("comfortable")}
              title="Comfortable view"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={cardDensity === "compact" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setCardDensity("compact")}
              title="Compact view"
            >
              <StretchHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <PokemonSkeletonGrid count={recentIds.length} />
        ) : filteredAndOrderedPokemon.length === 0 ? (
          <EmptyState
            title="No matches found"
            description={`We couldn't find any recently viewed Pokémon matching "${searchQuery}".`}
            icon={<SearchX className="h-6 w-6 text-muted-foreground" />}
          >
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Clear search
            </Button>
          </EmptyState>
        ) : (
          <PokemonGrid density={cardDensity}>
            {filteredAndOrderedPokemon.map((pokemon) => (
              <PokemonCard
                key={pokemon.id}
                pokemon={pokemon}
                density={cardDensity}
              />
            ))}
          </PokemonGrid>
        )}
      </div>
    </Container>
  );
}
