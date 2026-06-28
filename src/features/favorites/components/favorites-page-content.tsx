"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  SearchX,
  LayoutGrid,
  StretchHorizontal,
  ArrowUpAz,
  ArrowDownAz,
  ArrowUp10,
  ArrowDown10,
  Heart
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
import { useFavorites } from "@/features/favorites/hooks/useFavorites";
import { useFavoritePokemon } from "@/features/favorites/hooks/use-favorite-pokemon";
import { useUserPreferencesStore } from "@/store/user-preferences-store";
import { useSort } from "@/features/search/hooks/useSort";
import { SortConfig } from "@/features/search/sort";
import { filterPokemon } from "../utils/favorites.sorting";

export function FavoritesPageContent() {
  const router = useRouter();
  const { favoriteIds, favoriteCount } = useFavorites();
  const { cardDensity, setCardDensity } = useUserPreferencesStore();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortConfig, setSortConfig] = React.useState<SortConfig>({
    field: "id",
    direction: "asc",
  });

  const { data: pokemonDetails, isLoading, isError, error, refetch } = useFavoritePokemon(favoriteIds);

  // Instant visual updates: Filter existing details by the current favoriteIds
  // This prevents flickering when removing a favorite.
  const currentPokemonDetails = React.useMemo(() => {
    if (!pokemonDetails) return [];
    return pokemonDetails.filter(p => favoriteIds.includes(p.id));
  }, [pokemonDetails, favoriteIds]);

  const filteredPokemon = React.useMemo(() => {
    if (!currentPokemonDetails) return [];
    return filterPokemon(currentPokemonDetails, searchQuery);
  }, [currentPokemonDetails, searchQuery]);

  const sortedPokemon = useSort(filteredPokemon, sortConfig);

  if (favoriteIds.length === 0) {
    return (
      <Container>
        <PageHeader
          title="Favorites"
          description="Your personal collection of Pokémon."
        />
        <div className="py-20">
          <EmptyState
            title="No favorites yet"
            description="Start exploring and heart your favorite Pokémon to see them here!"
            icon={<Heart className="h-12 w-12 text-muted-foreground/40" />}
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
          title="Favorites"
          description="Your personal collection of Pokémon."
        />
        <div className="py-12">
          <ErrorMessage
            message={error?.message || "Failed to load favorite Pokémon. Please try again."}
            onRetry={() => refetch()}
          />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <PageHeader
        title="Favorites"
        description="Your personal collection of Pokémon."
      />

      <div className="space-y-8 pb-20">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
             <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Heart className="h-4 w-4 text-primary fill-primary" />
                <span>{favoriteCount} Pokémon Saved</span>
             </div>
             <div className="flex flex-wrap gap-4">
                <SearchInput
                  placeholder="Search favorites..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-[300px]"
                />

                <div className="flex items-center gap-1 rounded-md border border-border/50 bg-card/30 p-1">
                  <Button
                    variant={sortConfig.field === "id" && sortConfig.direction === "asc" ? "secondary" : "ghost"}
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => setSortConfig({ field: "id", direction: "asc" })}
                    title="Sort by Number (Ascending)"
                  >
                    <ArrowUp10 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={sortConfig.field === "id" && sortConfig.direction === "desc" ? "secondary" : "ghost"}
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => setSortConfig({ field: "id", direction: "desc" })}
                    title="Sort by Number (Descending)"
                  >
                    <ArrowDown10 className="h-4 w-4" />
                  </Button>
                  <div className="mx-1 h-4 w-px bg-border/50" />
                  <Button
                    variant={sortConfig.field === "name" && sortConfig.direction === "asc" ? "secondary" : "ghost"}
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => setSortConfig({ field: "name", direction: "asc" })}
                    title="Sort by Name (A-Z)"
                  >
                    <ArrowUpAz className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={sortConfig.field === "name" && sortConfig.direction === "desc" ? "secondary" : "ghost"}
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => setSortConfig({ field: "name", direction: "desc" })}
                    title="Sort by Name (Z-A)"
                  >
                    <ArrowDownAz className="h-4 w-4" />
                  </Button>
                </div>
             </div>
          </div>

          <div className="flex items-center gap-1 rounded-md border border-border/50 bg-card/30 p-1 self-start lg:self-auto">
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
          <PokemonSkeletonGrid count={favoriteIds.length} />
        ) : sortedPokemon.length === 0 ? (
          <EmptyState
            title="No matches found"
            description={`We couldn't find any of your favorites matching "${searchQuery}".`}
            icon={<SearchX className="h-6 w-6 text-muted-foreground" />}
          >
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Clear search
            </Button>
          </EmptyState>
        ) : (
          <PokemonGrid density={cardDensity}>
            {sortedPokemon.map((pokemon) => (
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
