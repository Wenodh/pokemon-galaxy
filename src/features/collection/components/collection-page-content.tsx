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
  Briefcase
} from "lucide-react";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/page-header";
import { ErrorMessage } from "@/components/common/error-message";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { PokemonGrid } from "@/features/pokedex/components/pokemon-grid";
import { PokemonCard } from "@/features/pokedex/components/pokemon-card";
import { PokemonSkeletonGrid } from "@/features/pokedex/components/pokemon-skeleton";
import { useUserPreferencesStore } from "@/store/user-preferences-store";
import { useSort } from "@/features/search/hooks/useSort";
import { SortConfig } from "@/features/search/sort";
import { useCollectionStore } from "../store/collection.store";
import { useCollectionPokemon } from "../hooks/use-collection-pokemon";
import { PokemonSearch } from "@/features/pokedex/components/pokemon-search";
import { SavedViewsDropdown } from "@/features/saved-views/components/SavedViewsDropdown";
import { useSavedViewActions } from "@/features/saved-views";
import { filterPokemon } from "@/features/favorites/utils/favorites.sorting";

export function CollectionPageContent() {
  const router = useRouter();
  const entries = useCollectionStore((state) => state.entries);
  const caughtIds = React.useMemo(() =>
    Object.values(entries).filter(e => e.caught).map(e => e.pokemonId),
  [entries]);

  const { cardDensity, setCardDensity } = useUserPreferencesStore();
  const { applyView } = useSavedViewActions();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortConfig, setSortConfig] = React.useState<SortConfig>({
    field: "id",
    direction: "asc",
  });

  const { data: pokemonDetails, isLoading, isError, error, refetch } = useCollectionPokemon(caughtIds);

  const currentPokemonDetails = React.useMemo(() => {
    if (!pokemonDetails) return [];
    return pokemonDetails.filter(p => caughtIds.includes(p.id));
  }, [pokemonDetails, caughtIds]);

  const filteredPokemon = React.useMemo(() => {
    if (!currentPokemonDetails) return [];
    return filterPokemon(currentPokemonDetails, searchQuery);
  }, [currentPokemonDetails, searchQuery]);

  const sortedPokemon = useSort(filteredPokemon, sortConfig);

  const handleApplyView = React.useCallback((newSearch: string, newSort: SortConfig) => {
    setSearchQuery(newSearch);
    setSortConfig(newSort);
  }, []);

  const handleReset = React.useCallback(() => {
    setSearchQuery("");
    setSortConfig({ field: "id", direction: "asc" });
  }, []);

  if (caughtIds.length === 0) {
    return (
      <Container>
        <PageHeader
          title="Collection"
          description="Every Pokémon you have caught."
        />
        <div className="py-20">
          <EmptyState
            title="Collection is empty"
            description="Start exploring the Pokédex to build your personal collection!"
            icon={<Briefcase className="h-12 w-12 text-muted-foreground/40" />}
          >
            <Button onClick={() => router.push("/pokedex")}>
              Explore Pokédex
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
          title="Collection"
          description="Every Pokémon you have caught."
        />
        <div className="py-12">
          <ErrorMessage
            message={error?.message || "Failed to load collection. Please try again."}
            onRetry={() => refetch()}
          />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <PageHeader
        title="Collection"
        description="Every Pokémon you have caught."
      />

      <div className="space-y-8 pb-20">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
             <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Briefcase className="h-4 w-4 text-primary" />
                <span>{caughtIds.length} Pokémon Caught</span>
             </div>
             <div className="flex flex-wrap gap-4">
                <SavedViewsDropdown
                  currentSearch={searchQuery}
                  currentSort={sortConfig}
                  onApplyView={handleApplyView}
                  onReset={handleReset}
                />
                <PokemonSearch
                  className="w-full sm:w-[300px]"
                  value={searchQuery}
                  onChange={(val) => {
                    setSearchQuery(val);
                    applyView(null);
                  }}
                />

                <div className="flex items-center gap-1 rounded-md border border-border/50 bg-card/30 p-1">
                  <Button
                    variant={sortConfig.field === "id" && sortConfig.direction === "asc" ? "secondary" : "ghost"}
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => {
                      setSortConfig({ field: "id", direction: "asc" });
                      applyView(null);
                    }}
                    title="Sort by Number (Ascending)"
                  >
                    <ArrowUp10 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={sortConfig.field === "id" && sortConfig.direction === "desc" ? "secondary" : "ghost"}
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => {
                      setSortConfig({ field: "id", direction: "desc" });
                      applyView(null);
                    }}
                    title="Sort by Number (Descending)"
                  >
                    <ArrowDown10 className="h-4 w-4" />
                  </Button>
                  <div className="mx-1 h-4 w-px bg-border/50" />
                  <Button
                    variant={sortConfig.field === "name" && sortConfig.direction === "asc" ? "secondary" : "ghost"}
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => {
                      setSortConfig({ field: "name", direction: "asc" });
                      applyView(null);
                    }}
                    title="Sort by Name (A-Z)"
                  >
                    <ArrowUpAz className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={sortConfig.field === "name" && sortConfig.direction === "desc" ? "secondary" : "ghost"}
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => {
                      setSortConfig({ field: "name", direction: "desc" });
                      applyView(null);
                    }}
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
          <PokemonSkeletonGrid count={caughtIds.length} />
        ) : sortedPokemon.length === 0 ? (
          <EmptyState
            title="No matches found"
            description={`We couldn't find any of your caught Pokémon matching "${searchQuery}".`}
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
