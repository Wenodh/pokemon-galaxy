"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PokemonListItem } from "../types";
import { CardDensity } from "@/store/user-preferences-store";

interface PokemonCardProps {
  pokemon: PokemonListItem;
  className?: string;
  density?: CardDensity;
}

const typeColors: Record<string, string> = {
  normal: "bg-zinc-400 dark:bg-zinc-500",
  fire: "bg-orange-500",
  water: "bg-blue-500",
  grass: "bg-emerald-500",
  electric: "bg-yellow-400 text-black",
  ice: "bg-cyan-300 text-black",
  fighting: "bg-red-600",
  poison: "bg-purple-500",
  ground: "bg-amber-600",
  flying: "bg-indigo-400",
  psychic: "bg-pink-500",
  bug: "bg-lime-500",
  rock: "bg-stone-500",
  ghost: "bg-violet-700",
  dragon: "bg-indigo-600",
  dark: "bg-zinc-800",
  steel: "bg-slate-400",
  fairy: "bg-pink-300 text-black",
};

export function PokemonCard({ pokemon, className, density = "comfortable" }: PokemonCardProps) {
  const isCompact = density === "compact";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        as="article"
        className={cn(
          "group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:bg-card transition-all duration-300",
          className
        )}
      >
        <div className={cn("relative aspect-square overflow-hidden", isCompact ? "p-3" : "p-6")}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Image
            src={pokemon.image}
            alt={pokemon.name}
            fill
            className={cn(
              "object-contain transition-transform duration-500 group-hover:scale-110",
              isCompact ? "p-2" : "p-4"
            )}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <div className={cn("pt-0", isCompact ? "p-3" : "p-5")}>
          <div className="mb-1 text-[10px] font-mono text-muted-foreground">
            #{pokemon.id.toString().padStart(3, "0")}
          </div>
          <h3
            className={cn(
              "capitalize tracking-tight group-hover:text-primary transition-colors font-bold",
              isCompact ? "mb-1 text-sm leading-tight" : "mb-3 text-xl"
            )}
          >
            {pokemon.name}
          </h3>
          {!isCompact && (
            <div className="flex flex-wrap gap-1.5">
              {pokemon.types.map((type) => (
                <Badge
                  key={type}
                  variant="secondary"
                  className={cn(
                    "rounded-md border-none px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white",
                    typeColors[type.toLowerCase()] || "bg-slate-500"
                  )}
                >
                  {type}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
