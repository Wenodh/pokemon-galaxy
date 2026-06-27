"use client";

import Link from "next/link";
import { ArrowRight, Search, Layout, Rocket, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { PageLayout } from "@/components/layout/page-layout";
import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { Button } from "@/components/ui/button";
import { PokemonCard } from "@/features/pokedex/components/pokemon-card";
import { PokemonGrid } from "@/features/pokedex/components/pokemon-grid";
import { PokemonSkeletonGrid } from "@/features/pokedex/components/pokemon-skeleton";
import { useFeaturedPokemon } from "@/features/pokedex/hooks/use-featured-pokemon";

export default function Home() {
  const { data: featured, isLoading, refetch, isFetching } = useFeaturedPokemon(6);

  const handleRandomize = () => {
    refetch();
  };

  return (
    <PageLayout>
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center"
          >
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8">
              <Sparkles className="mr-2 h-4 w-4" />
              <span>Discover the Pokémon Galaxy</span>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl mb-8 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent leading-[1.1]">
              Discover Every <br /> Pokémon.
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 mb-12">
              Explore the Pokémon universe with a fast, beautiful, and modern
              Pokédex designed for discovery.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" className="h-12 px-8 text-base" asChild>
                <Link href="/pokedex">
                  Explore Pokédex <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base"
                onClick={handleRandomize}
                disabled={isFetching}
              >
                {isFetching ? "Searching..." : "Random Pokémon"}
              </Button>
            </div>
          </motion.div>
        </Container>

        {/* Ambient Background */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,var(--color-primary)_0%,transparent_100%)] opacity-[0.03]" />
      </div>

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

      {/* Features Section */}
      <Section>
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Engineered for Trainers
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              The tools you need to explore the Pokémon world with precision.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="group relative rounded-2xl border border-border bg-card p-8 transition-all hover:shadow-lg">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Lightning-fast Search</h3>
              <p className="text-muted-foreground leading-relaxed">
                Instantly find any Pokémon by name or Pokédex number with our
                optimized search engine.
              </p>
            </div>
            <div className="group relative rounded-2xl border border-border bg-card p-8 transition-all hover:shadow-lg">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                <Layout className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Explore by Region</h3>
              <p className="text-muted-foreground leading-relaxed">
                Filter and discover Pokémon from Kanto to Paldea with a single
                click (Coming soon).
              </p>
            </div>
            <div className="group relative rounded-2xl border border-border bg-card p-8 transition-all hover:shadow-lg">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                <Rocket className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Modern Profiles</h3>
              <p className="text-muted-foreground leading-relaxed">
                Beautiful, detailed profiles with high-resolution artwork and
                comprehensive stats.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </PageLayout>
  );
}
