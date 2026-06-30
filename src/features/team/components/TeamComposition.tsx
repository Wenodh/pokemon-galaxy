"use client";

import { TeamSlot } from "./TeamSlot";
import { useTeamPokemon } from "../hooks/useTeamPokemon";
import { useActiveTeam } from "../hooks/useActiveTeam";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export const TeamComposition = () => {
  const { team, isLoading } = useTeamPokemon();
  const { removePokemon } = useActiveTeam();

  const handleRemove = (pokemonId: number, pokemonName: string) => {
    if (team) {
      const result = removePokemon(team.id, pokemonId);
      if (result.ok) {
        toast.success(`Removed ${pokemonName} from team.`);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  const hasPokemon = (team?.pokemonDetails?.length ?? 0) > 0;

  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 6 }).map((_, index) => {
        const pokemon = team?.pokemonDetails?.[index];
        return (
          <TeamSlot
            key={pokemon ? `filled-${pokemon.id}` : `empty-${index}`}
            index={index}
            pokemon={pokemon}
            onRemove={pokemon ? () => handleRemove(pokemon.id, pokemon.name) : undefined}
          />
        );
      })}

      {!hasPokemon && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center py-8 border-2 border-dashed border-border/30 rounded-2xl bg-muted/5 px-6"
        >
           <p className="text-sm font-bold text-foreground mb-1.5">Your team is empty</p>
           <p className="text-xs text-muted-foreground max-w-[220px] mx-auto leading-relaxed">
             Search Pokémon on the right and start building your ultimate team.
           </p>
        </motion.div>
      )}
    </div>
  );
};
