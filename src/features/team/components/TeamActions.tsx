"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreVertical,
  Pencil,
  Copy,
  Trash,
  Star
} from "lucide-react";
import { Team } from "../types/team.types";
import { useTeams } from "../hooks/useTeams";
import { useActiveTeam } from "../hooks/useActiveTeam";

interface TeamActionsProps {
  team: Team;
  onRename: (team: Team) => void;
  onDelete: (team: Team) => void;
  onActionComplete?: (message: string) => void;
}

export const TeamActions = ({
  team,
  onRename,
  onDelete,
  onActionComplete,
}: TeamActionsProps) => {
  const { duplicateTeam } = useTeams();
  const { setActiveTeam, activeTeamId } = useActiveTeam();
  const isActive = activeTeamId === team.id;

  const handleDuplicate = () => {
    const result = duplicateTeam(team.id);
    if (result.ok) {
      onActionComplete?.("Team duplicated successfully.");
    }
  };

  const handleSetActive = () => {
    setActiveTeam(team.id);
    onActionComplete?.(`"${team.name}" set as active team.`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          aria-label={`Actions for ${team.name}`}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleSetActive} disabled={isActive}>
          <Star className="mr-2 h-4 w-4" />
          <span>Set as Active</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onRename(team)}>
          <Pencil className="mr-2 h-4 w-4" />
          <span>Rename</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDuplicate}>
          <Copy className="mr-2 h-4 w-4" />
          <span>Duplicate</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onDelete(team)}
          className="text-destructive focus:text-destructive"
        >
          <Trash className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
