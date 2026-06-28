"use client";

import * as React from "react";
import { Eye, CheckCircle2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCollectionStatus } from "../hooks/useCollectionStatus";
import { useCollectionActions } from "../hooks/useCollectionActions";
import { PokemonId } from "../types/collection.types";

interface CollectionControlsProps {
  pokemonId: PokemonId;
  className?: string;
}

export function CollectionControls({ pokemonId, className }: CollectionControlsProps) {
  const { isSeen, isCaught, isShiny } = useCollectionStatus(pokemonId);
  const { markSeen, markCaught, markShiny, removeFromCollection } = useCollectionActions();

  const handleToggleSeen = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSeen && !isCaught && !isShiny) {
        // If it's only seen, remove it completely to keep store clean
        removeFromCollection(pokemonId);
    } else {
        markSeen(pokemonId);
    }
  };

  const handleToggleCaught = (e: React.MouseEvent) => {
    e.preventDefault();
    markCaught(pokemonId, !isCaught);
  };

  const handleToggleShiny = (e: React.MouseEvent) => {
    e.preventDefault();
    markShiny(pokemonId, !isShiny);
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <h3 className="text-lg font-bold">Collection</h3>
      <div className="flex flex-wrap gap-3">
        <StatusToggle
          label="Seen"
          active={isSeen}
          onClick={handleToggleSeen}
          icon={<Eye className="h-4 w-4" />}
          activeClassName="text-blue-500 bg-blue-500/10 border-blue-500/50"
        />
        <StatusToggle
          label="Caught"
          active={isCaught}
          onClick={handleToggleCaught}
          icon={<CheckCircle2 className="h-4 w-4" />}
          activeClassName="text-green-500 bg-green-500/10 border-green-500/50"
        />
        <StatusToggle
          label="Shiny"
          active={isShiny}
          onClick={handleToggleShiny}
          icon={<Sparkles className="h-4 w-4" />}
          activeClassName="text-yellow-500 bg-yellow-500/10 border-yellow-500/50"
        />
      </div>
    </div>
  );
}

interface StatusToggleProps {
  label: string;
  active: boolean;
  onClick: (e: React.MouseEvent) => void;
  icon: React.ReactNode;
  activeClassName: string;
}

function StatusToggle({ label, active, onClick, icon, activeClassName }: StatusToggleProps) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex h-11 min-w-[100px] items-center justify-center gap-2 rounded-full border border-border px-4 transition-all hover:bg-accent",
        active && activeClassName
      )}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
