"use client";

import { useState, useCallback } from "react";
import { Team } from "../types/team.types";

export type DialogType = "create" | "rename" | "delete" | null;

export const useTeamDialogs = () => {
  const [activeDialog, setActiveDialog] = useState<DialogType>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const openCreateDialog = useCallback(() => {
    setSelectedTeam(null);
    setActiveDialog("create");
  }, []);

  const openRenameDialog = useCallback((team: Team) => {
    setSelectedTeam(team);
    setActiveDialog("rename");
  }, []);

  const openDeleteDialog = useCallback((team: Team) => {
    setSelectedTeam(team);
    setActiveDialog("delete");
  }, []);

  const closeDialogs = useCallback(() => {
    setActiveDialog(null);
    setSelectedTeam(null);
  }, []);

  return {
    activeDialog,
    selectedTeam,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    closeDialogs,
  };
};
