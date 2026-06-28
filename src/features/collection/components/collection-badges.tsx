"use client";

import { Eye, CheckCircle2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCollectionStatus } from "../hooks/useCollectionStatus";
import { PokemonId } from "../types/collection.types";

interface CollectionBadgesProps {
  pokemonId: PokemonId;
  className?: string;
  size?: "sm" | "md";
}

export function CollectionBadges({ pokemonId, className, size = "sm" }: CollectionBadgesProps) {
  const { isSeen, isCaught, isShiny } = useCollectionStatus(pokemonId);

  if (!isSeen && !isCaught && !isShiny) return null;

  const iconSize = size === "sm" ? "h-3 w-3" : "h-4 w-4";

  return (
    <div className={cn("flex gap-1.5", className)}>
      {isSeen && (
        <div
          className="flex items-center gap-1 rounded bg-blue-500/10 px-1 py-0.5 text-blue-500 dark:bg-blue-500/20"
          title="Seen"
        >
          <Eye className={iconSize} aria-hidden="true" />
          <span className="sr-only">Seen</span>
        </div>
      )}
      {isCaught && (
        <div
          className="flex items-center gap-1 rounded bg-green-500/10 px-1 py-0.5 text-green-500 dark:bg-green-500/20"
          title="Caught"
        >
          <CheckCircle2 className={iconSize} aria-hidden="true" />
          <span className="sr-only">Caught</span>
        </div>
      )}
      {isShiny && (
        <div
          className="flex items-center gap-1 rounded bg-yellow-500/10 px-1 py-0.5 text-yellow-500 dark:bg-yellow-500/20"
          title="Shiny"
        >
          <Sparkles className={iconSize} aria-hidden="true" />
          <span className="sr-only">Shiny</span>
        </div>
      )}
    </div>
  );
}
