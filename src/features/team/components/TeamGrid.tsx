"use client";

import { useTeams } from "../hooks/useTeams";
import { TeamCard } from "./TeamCard";
import { EmptyState } from "@/components/common/empty-state";
import { Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Team } from "../types/team.types";

interface TeamGridProps {
  onRename: (team: Team) => void;
  onDelete: (team: Team) => void;
  onCreateOpen: () => void;
  onActionComplete?: (message: string) => void;
}

export const TeamGrid = ({
  onRename,
  onDelete,
  onCreateOpen,
  onActionComplete,
}: TeamGridProps) => {
  const { teams } = useTeams();

  if (teams.length === 0) {
    return (
      <div className="py-12">
        <EmptyState
          title="No Teams Yet"
          description="Create your first team to start planning your strategy."
          icon={<Users className="h-10 w-10 text-muted-foreground" />}
        >
          <Button onClick={onCreateOpen} className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Team
          </Button>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 py-6">
      {teams.map((team) => (
        <TeamCard
          key={team.id}
          team={team}
          onRename={onRename}
          onDelete={onDelete}
          onActionComplete={onActionComplete}
        />
      ))}
    </div>
  );
};
