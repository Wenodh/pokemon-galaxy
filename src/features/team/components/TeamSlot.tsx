"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { PokemonListItem } from "@/features/pokedex/types";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface TeamSlotProps {
  pokemon?: PokemonListItem;
  onRemove?: () => void;
  index: number;
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

export const TeamSlot = ({ pokemon, onRemove, index }: TeamSlotProps) => {
  return (
    <AnimatePresence mode="wait">
      {!pokemon ? (
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex h-24 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border/40 bg-muted/20 p-4 transition-colors hover:border-border/60 hover:bg-muted/30"
          aria-label={`Empty team slot ${index + 1}`}
        >
          <Plus className="h-4 w-4 text-muted-foreground/40" aria-hidden="true" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
            Empty Slot
          </span>
          <span className="text-[9px] text-muted-foreground/40 hidden sm:block">
            Search Pokémon to add
          </span>
        </motion.div>
      ) : (
        <motion.div
          key={pokemon.id}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="group relative flex h-24 items-center gap-4 rounded-xl border border-border/50 bg-card p-3 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
        >
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted/50 p-2 transition-transform group-hover:scale-105">
            <Image
              src={pokemon.image}
              alt={pokemon.name}
              fill
              className="object-contain"
              sizes="64px"
            />
          </div>

          <div className="flex flex-1 flex-col justify-center overflow-hidden">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-medium text-muted-foreground/70">
                #{pokemon.id.toString().padStart(3, "0")}
              </span>
              <h4 className="truncate text-sm font-bold capitalize leading-none tracking-tight">
                {pokemon.name}
              </h4>
            </div>

            <div className="mt-2.5 flex flex-wrap gap-1">
              {pokemon.types.map((type) => (
                <Badge
                  key={type}
                  variant="secondary"
                  className={cn(
                    "rounded-md border-none px-2 py-0 text-[9px] font-black uppercase tracking-tight text-white h-4.5",
                    typeColors[type.toLowerCase()] || "bg-slate-500"
                  )}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center">
             <Button
              variant="ghost"
              size="sm"
              className="h-9 w-auto px-3 lg:w-9 lg:px-0 text-muted-foreground/60 hover:bg-destructive/10 hover:text-destructive transition-colors rounded-lg group/remove"
              onClick={(e) => {
                e.stopPropagation();
                onRemove?.();
              }}
              title="Remove from team"
              aria-label={`Remove ${pokemon.name} from team`}
            >
              <Trash2 className="h-4.5 w-4.5" />
              <span className="ml-2 text-[10px] font-black uppercase tracking-widest lg:hidden">Remove</span>
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
