"use client";

import { useState, useCallback } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { Container } from "@/components/common/container";
import { TeamHeader } from "../components/TeamHeader";
import { TeamGrid } from "../components/TeamGrid";
import { CreateTeamDialog } from "../components/CreateTeamDialog";
import { RenameTeamDialog } from "../components/RenameTeamDialog";
import { DeleteTeamDialog } from "../components/DeleteTeamDialog";
import { useTeamDialogs } from "../hooks/useTeamDialogs";

export const TeamsPage = () => {
  const {
    activeDialog,
    selectedTeam,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    closeDialogs,
  } = useTeamDialogs();

  const [announcement, setAnnouncement] = useState<string | null>(null);

  const handleActionComplete = useCallback((message: string) => {
    setAnnouncement(message);
    // Clear announcement after screen readers have had a chance to read it
    setTimeout(() => setAnnouncement(null), 3000);
  }, []);

  return (
    <PageLayout>
      <Container>
        <TeamHeader onCreateOpen={openCreateDialog} />

        <TeamGrid
          onCreateOpen={openCreateDialog}
          onRename={openRenameDialog}
          onDelete={openDeleteDialog}
          onActionComplete={handleActionComplete}
        />

        <CreateTeamDialog
          open={activeDialog === "create"}
          onOpenChange={closeDialogs}
          onSuccess={() => handleActionComplete("Team created successfully.")}
        />

        <RenameTeamDialog
          team={selectedTeam}
          open={activeDialog === "rename"}
          onOpenChange={closeDialogs}
          onSuccess={() => handleActionComplete("Team renamed successfully.")}
        />

        <DeleteTeamDialog
          team={selectedTeam}
          open={activeDialog === "delete"}
          onOpenChange={closeDialogs}
          onSuccess={() => handleActionComplete("Team deleted successfully.")}
        />

        {/* ARIA Live Region for Accessibility Announcements */}
        <div
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {announcement}
        </div>
      </Container>
    </PageLayout>
  );
};
