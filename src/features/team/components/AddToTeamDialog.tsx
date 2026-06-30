"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTeams } from "../hooks/useTeams";
import { useActiveTeam } from "../hooks/useActiveTeam";
import { PokemonListItem } from "@/features/pokedex/types";
import { toast } from "sonner";
import { Users, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AddToTeamDialogProps {
  pokemon: PokemonListItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddToTeamDialog = ({
  pokemon,
  open,
  onOpenChange,
}: AddToTeamDialogProps) => {
  const { teams } = useTeams();
  const { addPokemon, activeTeamId } = useActiveTeam();

  const handleAdd = (teamId: string, teamName: string) => {
    if (!pokemon) return;

    const result = addPokemon(teamId, pokemon.id);
    if (result.ok) {
      toast.success(`Added ${pokemon.name} to ${teamName}.`);
      onOpenChange(false);
    } else {
      switch (result.error) {
        case "TEAM_FULL":
          toast.error(`Team "${teamName}" is full (max 6 Pokémon).`);
          break;
        case "DUPLICATE_POKEMON":
          toast.error(`${pokemon.name} is already in "${teamName}".`);
          break;
        default:
          toast.error("Failed to add Pokémon to team.");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add {pokemon?.name} to Team</DialogTitle>
          <DialogDescription>
            Choose a team to add this Pokémon to.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2.5 py-4">
          {teams.map((team) => {
            const isActive = team.id === activeTeamId;

            return (
              <Button
                key={team.id}
                variant="outline"
                className={`group justify-between h-auto py-3.5 px-4 rounded-xl border-border/60 hover:bg-primary/5 hover:border-primary/30 transition-all ${isActive ? 'bg-primary/5 border-primary/20 shadow-sm' : ''}`}
                onClick={() => handleAdd(team.id, team.name)}
              >
                <div className="flex flex-col items-start text-left gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm truncate max-w-[200px]">{team.name}</span>
                    {isActive && (
                      <Badge variant="default" className="h-4.5 px-1.5 text-[9px] font-black uppercase tracking-tighter bg-primary/20 text-primary border-none hover:bg-primary/20">
                        Active
                      </Badge>
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground font-bold flex items-center uppercase tracking-wider">
                    <Users className="mr-1.5 h-3 w-3" />
                    {team.pokemon.length} / 6 Members
                  </span>
                </div>

                {isActive && <Star className="h-4 w-4 text-primary fill-primary/20" />}
              </Button>
            );
          })}

          {teams.length === 0 && (
             <div className="py-8 text-center border-2 border-dashed rounded-xl bg-muted/5">
                <p className="text-sm font-bold text-muted-foreground">No teams available</p>
                <p className="text-xs text-muted-foreground mt-1">Create a team first to add Pokémon.</p>
             </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
