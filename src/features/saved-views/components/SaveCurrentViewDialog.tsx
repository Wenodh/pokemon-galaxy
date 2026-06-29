"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSavedViewActions } from "../hooks/useSavedViews";
import { SortConfig } from "@/features/search/sort";

interface SaveCurrentViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentSearch: string;
  currentSort: SortConfig;
  editingViewId?: string;
  defaultName?: string;
}

export function SaveCurrentViewDialog({
  open,
  onOpenChange,
  currentSearch,
  currentSort,
  editingViewId,
  defaultName = "",
}: SaveCurrentViewDialogProps) {
  const [name, setName] = React.useState(defaultName);
  const [error, setError] = React.useState<string | null>(null);
  const { saveView, renameView } = useSavedViewActions();

  // Reset name when dialog opens for a new view or different editing view
  React.useEffect(() => {
    if (open) {
      setName(defaultName);
      setError(null);
    }
  }, [open, defaultName]);

  const handleSave = () => {
    let result;
    if (editingViewId) {
      result = renameView(editingViewId, name);
    } else {
      result = saveView({
        name,
        search: currentSearch,
        sort: currentSort,
      });
    }

    if (result.success) {
      onOpenChange(false);
      setName("");
      setError(null);
    } else {
      setError(result.error || "An error occurred");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingViewId ? "Rename View" : "Save Current View"}</DialogTitle>
          <DialogDescription>
            {editingViewId
              ? "Enter a new name for your saved view."
              : "Save your current search and sort settings as a reusable view."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">View Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setName(e.target.value);
                setError(null);
              }}
              placeholder="e.g., Fire Attackers, Gen 1"
              maxLength={40}
              autoFocus
            />
            {error && (
              <p className="text-xs font-medium text-destructive">{error}</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {editingViewId ? "Rename" : "Save View"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
