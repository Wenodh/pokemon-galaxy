"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/common/section";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { PokemonGrid } from "@/features/pokedex/components/pokemon-grid";
import { PokemonCard } from "@/features/pokedex/components/pokemon-card";
import { PokemonSkeletonGrid } from "@/features/pokedex/components/pokemon-skeleton";
import { useFeaturedPokemon } from "@/features/pokedex/hooks/use-featured-pokemon";
import { RecentlyViewedSection } from "@/features/recently-viewed/components/recently-viewed-section";
import { Hero } from "./hero";

export function HomeContent() {
  const { data: featured, isLoading, refetch, isFetching } = useFeaturedPokemon(6);

  const handleRandomize = () => {
    refetch();
  };

  return (
    <>
      <Hero onRandomize={handleRandomize} isFetching={isFetching} />

      {/* Featured Section */}
      <Section className="bg-accent/5">
        <Container>
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Featured Pokémon
              </h2>
              <p className="mt-2 text-muted-foreground">
                A selection of Pokémon drifting through the galaxy.
              </p>
            </div>
            <Link
              href="/pokedex"
              className="group hidden items-center text-sm font-medium text-primary md:flex"
            >
              View all
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {isLoading ? (
            <PokemonSkeletonGrid count={6} />
          ) : (
            <PokemonGrid>
              {featured?.map((pokemon) => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} />
              ))}
            </PokemonGrid>
          )}

          <div className="mt-10 flex justify-center md:hidden">
            <Button variant="outline" asChild className="w-full">
              <Link href="/pokedex">View all Pokédex</Link>
            </Button>
          </div>
        </Container>
      </Section>

      <RecentlyViewedSection />
    </>
  );
}
