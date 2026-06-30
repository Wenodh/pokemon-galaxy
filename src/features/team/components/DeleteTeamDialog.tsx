"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTeams } from "../hooks/useTeams";
import { Team } from "../types/team.types";
import { toast } from "sonner";

interface DeleteTeamDialogProps {
  team: Team | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const DeleteTeamDialog = ({
  team,
  open,
  onOpenChange,
  onSuccess,
}: DeleteTeamDialogProps) => {
  const { deleteTeam } = useTeams();

  const handleDelete = () => {
    if (!team) return;
    const teamName = team.name;
    deleteTeam(team.id);
    toast.success(`Team "${teamName}" deleted.`);
    onSuccess?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Team</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{team?.name}&quot;? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
          >
            Delete Team
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
