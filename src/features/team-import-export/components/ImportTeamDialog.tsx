"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TeamImporter } from "../domain/importer";
import { ImportError } from "../types/import-export.types";
import { useTeams } from "@/features/team/hooks/useTeams";
import { useActiveTeam } from "@/features/team/hooks/useActiveTeam";
import { toast } from "sonner";
import { AlertCircle, Loader2, ClipboardPaste } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { pasteFromClipboard } from "../utils/clipboard";

interface ImportTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImportTeamDialog({ open, onOpenChange }: ImportTeamDialogProps) {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ImportError[]>([]);
  const { createTeam, getAllTeams } = useTeams();
  const { addPokemon } = useActiveTeam();

  const handlePaste = async () => {
    const text = await pasteFromClipboard();
    if (text) {
        setInputText(text);
    } else {
        toast.error("Could not access clipboard.");
    }
  };

  const handleImport = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setErrors([]);

    try {
      // Try JSON first, then Showdown
      let result = await TeamImporter.importFromJson(inputText);

      if (!result.success && result.errors[0].code === "INVALID_JSON") {
        result = await TeamImporter.importFromShowdown(inputText);
      }

      if (result.success && result.team) {
        // Handle name duplication
        let finalName = result.team.name || "Imported Team";
        const allTeams = getAllTeams();

        const nameExists = (name: string) => allTeams.some(t => t.name.toLowerCase() === name.toLowerCase());

        if (nameExists(finalName)) {
            let counter = 1;
            const baseName = finalName;
            while (nameExists(`${baseName} (Imported${counter > 1 ? ` ${counter}` : ""})`)) {
                counter++;
            }
            finalName = `${baseName} (Imported${counter > 1 ? ` ${counter}` : ""})`;
        }

        const createResult = createTeam(finalName);

        if (createResult.ok) {
            const teamId = createResult.value;
            for (const pokemonId of result.team.pokemonIds) {
                addPokemon(teamId, pokemonId);
            }
            toast.success("Team imported successfully.");
            setInputText("");
            onOpenChange(false);
        } else {
            toast.error(`Failed to create team: ${createResult.error}`);
        }
      } else {
        setErrors(result.errors);
      }
    } catch (error) {
      console.error("Import failed:", error);
      toast.error("An unexpected error occurred during import.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import Team</DialogTitle>
          <DialogDescription>
            Paste a Pokémon Galaxy JSON or a Pokémon Showdown team below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="relative">
            <Textarea
              placeholder="Paste team data here..."
              className="min-h-[200px] font-mono text-xs resize-none"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 h-8 px-2"
              onClick={handlePaste}
              disabled={isLoading}
            >
              <ClipboardPaste className="h-4 w-4 mr-1" />
              Paste
            </Button>
          </div>

          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Import failed</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside text-xs mt-1 space-y-1">
                  {errors.map((err, i) => (
                    <li key={i}>
                      {err.message}
                      {err.pokemon && <span className="font-bold"> ({err.pokemon})</span>}
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={isLoading || !inputText.trim()}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              "Import Team"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
