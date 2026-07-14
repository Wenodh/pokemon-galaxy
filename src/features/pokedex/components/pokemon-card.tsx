"use client";

import * as React from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PokemonListItem } from "../types";
import { CardDensity } from "@/store/user-preferences-store";
import { FavoriteButton } from "@/features/favorites/components/FavoriteButton";
import { CollectionBadges } from "@/features/collection/components/collection-badges";
import { Plus, Check, MoreHorizontal, FolderPlus } from "lucide-react";
import { useActiveTeam } from "@/features/team/hooks/useActiveTeam";
import { useTeams } from "@/features/team/hooks/useTeams";
import { AddToCollectionDialog } from "@/features/collections/components/AddToCollectionDialog";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PokemonCardProps {
  pokemon: PokemonListItem;
  className?: string;
  density?: CardDensity;
  mode?: "pokedex" | "team-builder";
  onAddToOtherTeam?: (pokemon: PokemonListItem) => void;
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

export function PokemonCard({
  pokemon,
  className,
  density = "comfortable",
  mode = "pokedex",
  onAddToOtherTeam,
}: PokemonCardProps) {
  const isCompact = density === "compact";
  const { activeTeam, addPokemon } = useActiveTeam();
  const { teams } = useTeams();

  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false);

  const isAlreadyInActiveTeam = activeTeam?.pokemon?.includes(pokemon.id) || false;

  const handleAddToCollectionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsCollectionDialogOpen(true);
  };

  const handleAddToActiveTeam = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!activeTeam) {
      toast.error("Please select an active team first.");
      return;
    }

    if (isAlreadyInActiveTeam) {
        return;
    }

    const result = addPokemon(activeTeam.id, pokemon.id);
    if (result.ok) {
      toast.success(`Added ${pokemon.name} to ${activeTeam.name}.`);
    } else {
      switch (result.error) {
        case "TEAM_FULL":
          toast.error("Team is full (max 6 Pokémon).", {
             description: "You've reached the maximum capacity of 6 Pokémon."
          });
          break;
        case "DUPLICATE_POKEMON":
          toast.error(`${pokemon.name} already in team.`, {
            description: "Duplicate Pokémon are not allowed in the same team."
          });
          break;
        default:
          toast.error("Failed to add Pokémon to team.");
      }
    }
  };

  const handleAddToTeamClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (teams.length === 0) {
      toast.error("No teams found", {
        description: "Create a team first to add Pokémon."
      });
      return;
    }

    if (teams.length === 1) {
      const result = addPokemon(teams[0].id, pokemon.id);
      if (result.ok) {
        toast.success(`Added ${pokemon.name} to ${teams[0].name}.`);
      } else {
         toast.error(`Could not add to ${teams[0].name}`, {
           description: result.error === "TEAM_FULL" ? "Team is full." : "Already in team."
         });
      }
      return;
    }

    onAddToOtherTeam?.(pokemon);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="group relative"
    >
      <Card
        as="article"
        className={cn(
          "relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/40 hover:bg-card transition-all duration-300 shadow-sm hover:shadow-md",
          className
        )}
      >
        {/* Navigation Link Overlay */}
        <Link
          href={`/pokemon/${pokemon.name}`}
          className="absolute inset-0 z-0"
          aria-label={`View details for ${pokemon.name}`}
        />

        {/* Actions Container */}
        <div className="absolute right-2 top-2 z-10 flex flex-col gap-1.5">
          <FavoriteButton
            pokemonId={pokemon.id}
            pokemonName={pokemon.name}
            size="sm"
            variant="ghost"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-sm border border-border/50"
                onClick={(e) => e.stopPropagation()}
                aria-label={`Options for ${pokemon.name}`}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {mode === "pokedex" && (
                <DropdownMenuItem onClick={handleAddToTeamClick} className="py-2.5 font-bold cursor-pointer">
                  <Plus className="mr-2 h-4 w-4 text-primary" />
                  <span>Add to Team</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={handleAddToCollectionClick} className="py-2.5 font-bold cursor-pointer">
                <FolderPlus className="mr-2 h-4 w-4 text-primary" />
                <span>Add to Collection</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className={cn("relative aspect-square overflow-hidden", isCompact ? "p-4" : "p-8")}>
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
              priority={pokemon.id <= 20}
            />
          </div>

          <div className={cn("pt-0", isCompact ? "px-4 pb-4" : "px-6 pb-6")}>
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[10px] font-mono font-bold text-muted-foreground/60 tracking-tighter">
              #{pokemon.id.toString().padStart(4, "0")}
            </div>
            <div className="flex items-center gap-2 relative z-10">
              {mode === "team-builder" && (
                <Button
                  size="sm"
                  variant={isAlreadyInActiveTeam ? "secondary" : "default"}
                  disabled={isAlreadyInActiveTeam}
                  className={cn(
                    "h-7 px-3 text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm transition-all",
                    !isAlreadyInActiveTeam && "hover:scale-105 active:scale-95"
                  )}
                  onClick={handleAddToActiveTeam}
                  aria-label={isAlreadyInActiveTeam ? `${pokemon.name} already in team` : `Add ${pokemon.name} to active team`}
                >
                  {isAlreadyInActiveTeam ? (
                    <>
                        <Check className="mr-1 h-3 w-3" />
                        Added
                    </>
                  ) : (
                    <>
                        <Plus className="mr-1 h-3 w-3" />
                        Add
                    </>
                  )}
                </Button>
              )}
              <CollectionBadges pokemonId={pokemon.id} size="sm" />
            </div>
          </div>
          <h3
            className={cn(
              "capitalize tracking-tight group-hover:text-primary transition-colors font-black",
              isCompact ? "mb-1 text-base leading-tight" : "mb-3 text-2xl"
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
                      "rounded-md border-none px-2.5 py-0.5 text-[10px] font-black uppercase tracking-tighter text-white shadow-sm",
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

        {isCollectionDialogOpen && (
          <AddToCollectionDialog
            pokemonId={pokemon.id}
            pokemonName={pokemon.name}
            open={isCollectionDialogOpen}
            onOpenChange={setIsCollectionDialogOpen}
          />
        )}
    </motion.div>
  );
}
