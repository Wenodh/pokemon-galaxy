"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/page-header";
import { ErrorMessage } from "@/components/common/error-message";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";
import { PokemonGrid } from "@/features/pokedex/components/pokemon-grid";
import { PokemonCard } from "@/features/pokedex/components/pokemon-card";
import { PokemonSearch } from "@/features/pokedex/components/pokemon-search";
import { PokemonSkeletonGrid } from "@/features/pokedex/components/pokemon-skeleton";
import { InfiniteLoader } from "@/features/pokedex/components/infinite-loader";
import { usePokemonList } from "@/features/pokedex/hooks/use-pokemon-list";

function PokedexContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const search = searchParams.get("search") || "";

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = usePokemonList({ search });

  if (isError) {
    return (
      <div className="py-12">
        <ErrorMessage
          message={error?.message || "Failed to load Pokémon. Please try again."}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const allPokemon = data?.pages.flat() || [];
  const isEmpty = !isLoading && allPokemon.length === 0;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <PokemonSearch />
        <p className="text-sm text-muted-foreground">
          Showing {allPokemon.length} Pokémon
        </p>
      </div>

      {isLoading ? (
        <PokemonSkeletonGrid count={20} />
      ) : isEmpty ? (
        <EmptyState
          title="No Pokémon found"
          description={`We couldn't find any Pokémon matching "${search}".`}
          icon={<SearchX className="h-6 w-6 text-muted-foreground" />}
        >
          <Button variant="outline" onClick={() => router.push("/pokedex")}>
            Clear search
          </Button>
        </EmptyState>
      ) : (
        <>
          <PokemonGrid>
            {allPokemon.map((pokemon, index) => (
              <PokemonCard
                key={`${pokemon.id}-${index}`}
                pokemon={pokemon}
              />
            ))}
          </PokemonGrid>
          <InfiniteLoader
            onLoadMore={fetchNextPage}
            hasNextPage={!!hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        </>
      )}
    </div>
  );
}

export default function PokedexPage() {
  return (
    <PageLayout>
      <Container>
        <PageHeader
          title="Pokédex"
          description="Browse and filter through the entire Pokémon universe."
        />
        <Suspense fallback={<PokemonSkeletonGrid count={20} />}>
          <PokedexContent />
        </Suspense>
      </Container>
    </PageLayout>
  );
}
