"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Team } from "../types/team.types";
import { TeamActions } from "./TeamActions";
import { Users, Star } from "lucide-react";
import { useActiveTeam } from "../hooks/useActiveTeam";
import { cn } from "@/lib/utils";

interface TeamCardProps {
  team: Team;
  onRename: (team: Team) => void;
  onDelete: (team: Team) => void;
  onActionComplete?: (message: string) => void;
}

export const TeamCard = ({
  team,
  onRename,
  onDelete,
  onActionComplete,
}: TeamCardProps) => {
  const { activeTeamId, setActiveTeam } = useActiveTeam();
  const isActive = activeTeamId === team.id;

  const lastUpdated = new Date(team.updatedAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Card
      className={cn(
        "group relative transition-all hover:shadow-md cursor-pointer",
        isActive && "ring-2 ring-primary border-primary bg-primary/5"
      )}
      onClick={() => {
        if (!isActive) {
          setActiveTeam(team.id);
          onActionComplete?.(`"${team.name}" set as active team.`);
        }
      }}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold line-clamp-1">
            {team.name}
          </CardTitle>
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="mr-1 h-3.5 w-3.5" />
            {team.pokemon.length} / 6 Pokémon
          </div>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <TeamActions
            team={team}
            onRename={onRename}
            onDelete={onDelete}
            onActionComplete={onActionComplete}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-muted-foreground">
            Updated {lastUpdated}
          </p>
          {isActive && (
            <Badge variant="default" className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-current" />
              Active
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
