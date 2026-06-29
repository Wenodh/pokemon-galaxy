"use client";

import {
  Pencil,
  Trash2,
  Copy,
  Check
} from "lucide-react";
import {
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SavedView } from "../types/saved-view.types";
import { useSavedViewActions } from "../hooks/useSavedViews";
import { cn } from "@/lib/utils";

interface SavedViewItemProps {
  view: SavedView;
  isActive: boolean;
  onApply: (view: SavedView) => void;
  onRename: (view: SavedView) => void;
}

export function SavedViewItem({
  view,
  isActive,
  onApply,
  onRename
}: SavedViewItemProps) {
  const { deleteView, duplicateView } = useSavedViewActions();

  return (
    <div className="group relative flex items-center pr-2">
      <DropdownMenuItem
        className={cn(
          "flex-1 cursor-pointer pr-8",
          isActive && "bg-accent text-accent-foreground font-medium"
        )}
        onClick={() => onApply(view)}
      >
        {isActive && <Check className="mr-2 h-4 w-4 shrink-0" />}
        <span className="truncate">{view.name}</span>
      </DropdownMenuItem>

      <div className="absolute right-2 flex items-center opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:text-foreground"
          onClick={(e) => {
            e.stopPropagation();
            onRename(view);
          }}
          title="Rename view"
        >
          <Pencil className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:text-foreground"
          onClick={(e) => {
            e.stopPropagation();
            duplicateView(view.id);
          }}
          title="Duplicate view"
        >
          <Copy className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={(e) => {
            e.stopPropagation();
            deleteView(view.id);
          }}
          title="Delete view"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
