"use client";

import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface TeamHeaderProps {
  onCreateOpen: () => void;
}

export const TeamHeader = ({ onCreateOpen }: TeamHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-8">
      <PageHeader
        title="My Teams"
        description="Manage your Pokémon teams and battle configurations."
        className="pb-0"
      />
      <Button onClick={onCreateOpen} size="lg" className="w-full sm:w-auto">
        <Plus className="mr-2 h-5 w-5" />
        New Team
      </Button>
    </div>
  );
};
