"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/container";
import Link from "next/link";

interface HeroProps {
  onRandomize: () => void;
  isFetching: boolean;
}

export function Hero({ onRandomize, isFetching }: HeroProps) {
  return (
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
              onClick={onRandomize}
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
  );
}
