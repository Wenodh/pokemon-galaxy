"use client";

import { useTeams } from "../hooks/useTeams";
import { useActiveTeam } from "../hooks/useActiveTeam";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  Plus,
} from "lucide-react";
import { Team } from "../types/team.types";
import { toast } from "sonner";

interface TeamSelectorProps {
  onRename: (team: Team) => void;
  onDelete: (team: Team) => void;
  onCreateOpen: () => void;
}

export const TeamSelector = ({
  onCreateOpen,
}: TeamSelectorProps) => {
  const { teams } = useTeams();
  const { activeTeam, activeTeamId, setActiveTeam } = useActiveTeam();

  const handleSetActive = (id: string) => {
    setActiveTeam(id);
    const team = teams.find(t => t.id === id);
    if (team) {
      toast.success(`"${team.name}" set as active team.`);
    }
  };

  return (
    <div className="flex items-center gap-2 w-full sm:w-auto">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full sm:w-[240px] justify-between h-11 px-4 rounded-xl shadow-sm hover:bg-muted/50 transition-all border-border/60">
            <span className="truncate font-bold">
              {activeTeam ? activeTeam.name : "Select a team"}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[240px]" align="end">
          <DropdownMenuLabel className="text-xs uppercase tracking-widest text-muted-foreground font-black py-2 px-3">Your Teams</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={activeTeamId || ""} onValueChange={handleSetActive}>
            {teams.map((team) => (
              <DropdownMenuRadioItem key={team.id} value={team.id} className="py-2.5 cursor-pointer">
                <div className="flex flex-col gap-0.5 overflow-hidden">
                  <span className="truncate font-bold text-sm">{team.name}</span>
                  <span className="text-[10px] text-muted-foreground font-medium">{team.pokemon.length} / 6 Pokémon</span>
                </div>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          {teams.length === 0 && (
            <div className="px-2 py-6 text-center text-sm text-muted-foreground">
              No teams yet
            </div>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onCreateOpen} className="py-2.5 cursor-pointer font-bold text-primary focus:text-primary">
            <Plus className="mr-2 h-4 w-4" />
            <span>Create New Team</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
