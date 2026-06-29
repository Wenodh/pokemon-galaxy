"use client";

import * as React from "react";
import {
  ChevronDown,
  Plus,
  RotateCcw,
  Bookmark
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useSavedViews, useSavedViewActions } from "../hooks/useSavedViews";
import { SaveCurrentViewDialog } from "./SaveCurrentViewDialog";
import { SavedViewItem } from "./SavedViewItem";
import { SavedView } from "../types/saved-view.types";
import { SortConfig } from "@/features/search/sort";
import { cn } from "@/lib/utils";

interface SavedViewsDropdownProps {
  currentSearch: string;
  currentSort: SortConfig;
  onApplyView: (search: string, sort: SortConfig) => void;
  onReset: () => void;
  className?: string;
}

export function SavedViewsDropdown({
  currentSearch,
  currentSort,
  onApplyView,
  onReset,
  className
}: SavedViewsDropdownProps) {
  const { views, activeViewId, activeView } = useSavedViews();
  const { applyView } = useSavedViewActions();
  const [isSaveDialogOpen, setIsSaveDialogOpen] = React.useState(false);
  const [editingView, setEditingView] = React.useState<SavedView | null>(null);

  const handleApply = (view: SavedView) => {
    applyView(view.id);
    onApplyView(view.search, view.sort);
  };

  const handleReset = () => {
    applyView(null);
    onReset();
  };

  const handleRename = (view: SavedView) => {
    setEditingView(view);
    setIsSaveDialogOpen(true);
  };

  const handleOpenSaveDialog = () => {
    setEditingView(null);
    setIsSaveDialogOpen(true);
  };

  return (
    <>
      <div className={cn("flex items-center gap-2", className)}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-10 gap-2 border-border/50 bg-card/30">
              <Bookmark className="h-4 w-4" />
              <span className="hidden sm:inline">
                {activeView ? activeView.name : "Views"}
              </span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[240px]">
            <DropdownMenuLabel>Views</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              className={cn(
                "cursor-pointer",
                !activeViewId && "bg-accent text-accent-foreground font-medium"
              )}
              onClick={handleReset}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Default
            </DropdownMenuItem>

            {views.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-y-auto">
                  {views.map((view) => (
                    <SavedViewItem
                      key={view.id}
                      view={view}
                      isActive={activeViewId === view.id}
                      onApply={handleApply}
                      onRename={handleRename}
                    />
                  ))}
                </div>
              </>
            )}

            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-primary focus:text-primary"
              onClick={handleOpenSaveDialog}
            >
              <Plus className="mr-2 h-4 w-4" />
              Save Current View
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <SaveCurrentViewDialog
        open={isSaveDialogOpen}
        onOpenChange={setIsSaveDialogOpen}
        currentSearch={currentSearch}
        currentSort={currentSort}
        editingViewId={editingView?.id}
        defaultName={editingView?.name}
      />
    </>
  );
}
