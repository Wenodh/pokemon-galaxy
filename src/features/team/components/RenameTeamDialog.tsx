"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTeams } from "../hooks/useTeams";
import { Team } from "../types/team.types";
import { toast } from "sonner";

interface RenameTeamDialogProps {
  team: Team | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const RenameTeamDialog = ({
  team,
  open,
  onOpenChange,
  onSuccess,
}: RenameTeamDialogProps) => {
  const { renameTeam } = useTeams();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && team) {
      setName(team.name);
      setError(null);
    }
  }, [open, team]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!team) return;

    const result = renameTeam(team.id, name);

    if (result.ok) {
      toast.success(`Team renamed to "${name}".`);
      onSuccess?.();
      onOpenChange(false);
    } else {
      switch (result.error) {
        case "EMPTY_NAME":
          setError("Team name cannot be empty.");
          break;
        case "DUPLICATE_NAME":
          setError("A team with this name already exists.");
          break;
        default:
          setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rename Team</DialogTitle>
          <DialogDescription>
            Enter a new name for your team.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="rename-team-name">Team Name</Label>
            <Input
              id="rename-team-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. My New Team Name"
              autoFocus
            />
            {error && (
              <p className="text-sm font-medium text-destructive">{error}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
