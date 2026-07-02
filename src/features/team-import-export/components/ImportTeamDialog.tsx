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
import { ImportError, ImportValidationResult } from "../types/import-export.types";
import { useTeams } from "@/features/team/hooks/useTeams";
import { useActiveTeam } from "@/features/team/hooks/useActiveTeam";
import { toast } from "sonner";
import { AlertCircle, Loader2, ClipboardPaste, CheckCircle2, ChevronRight, Info } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { pasteFromClipboard } from "../utils/clipboard";
import { Badge } from "@/components/ui/badge";

interface ImportTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImportTeamDialog({ open, onOpenChange }: ImportTeamDialogProps) {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ImportError[]>([]);
  const [previewResult, setPreviewResult] = useState<ImportValidationResult | null>(null);
  const { createTeam, getAllTeams } = useTeams();
  const { addPokemon } = useActiveTeam();

  const handlePaste = async () => {
    const text = await pasteFromClipboard();
    if (text) {
        setInputText(text);
        setPreviewResult(null);
        setErrors([]);
    } else {
        toast.error("Could not access clipboard.");
    }
  };

  const handlePreview = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setErrors([]);
    setPreviewResult(null);

    try {
      // Try JSON first, then Showdown
      let result = await TeamImporter.importFromJson(inputText);

      if (!result.success && result.errors[0].code === "INVALID_JSON") {
        result = await TeamImporter.importFromShowdown(inputText);
      }

      if (result.success && result.team) {
          setPreviewResult(result);
      } else {
        setErrors(result.errors);
      }
    } catch (error) {
      console.error("Import preview failed:", error);
      toast.error("An unexpected error occurred during import.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmImport = () => {
    if (!previewResult || !previewResult.team) return;

    const { team } = previewResult;

    // Handle name duplication
    let finalName = team.name || "Imported Team";
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
        const addResults = team.pokemonIds.map((pokemonId, index) => {
            const comp = team.competitive?.[index];
            return addPokemon(teamId, pokemonId, comp);
        });

        const failures = addResults.filter(r => !r.ok);
        if (failures.length > 0) {
            toast.error(`Imported team with some errors: ${failures.map(f => f.error).join(", ")}`);
        } else {
            toast.success("Team imported successfully.");
        }

        reset();
        onOpenChange(false);
    } else {
        toast.error(`Failed to create team: ${createResult.error}`);
    }
  };

  const reset = () => {
      setInputText("");
      setErrors([]);
      setPreviewResult(null);
      setIsLoading(false);
  };

  const handleClose = (open: boolean) => {
      if (!open) reset();
      onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Import Team</DialogTitle>
          <DialogDescription>
            {previewResult ? "Review your team before importing." : "Paste a Pokémon Galaxy JSON or a Pokémon Showdown team below."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {!previewResult ? (
            <div className="space-y-4">
                <div className="relative">
                    <Textarea
                    placeholder="Paste team data here..."
                    className="min-h-[300px] font-mono text-xs resize-none"
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
          ) : (
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        {previewResult.team?.name || "Imported Team"}
                    </h3>
                    <Badge variant="secondary">{previewResult.team?.pokemonIds.length} Pokémon</Badge>
                </div>

                <div className="max-h-[300px] overflow-y-auto pr-4 border rounded-md p-2 space-y-3">
                    {previewResult.team?.pokemonIds.map((id, index) => {
                        const comp = previewResult.team?.competitive?.[index];
                        return (
                            <div key={`${id}-${index}`} className="flex items-start gap-3 p-2 rounded-lg bg-muted/30 border border-border/50">
                                <div className="w-12 h-12 bg-background rounded border flex items-center justify-center overflow-hidden shrink-0">
                                    <img
                                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
                                        alt="Pokemon"
                                        className="w-10 h-10 object-contain"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-sm truncate">
                                                {comp?.nickname || comp?.species || `Pokémon #${id}`}
                                        </span>
                                        {comp?.nickname && (
                                            <span className="text-xs text-muted-foreground truncate">
                                                    ({comp.species})
                                            </span>
                                        )}
                                        {comp?.level && comp.level !== 100 && (
                                            <Badge variant="outline" className="text-[10px] h-4 px-1">Lv.{comp.level}</Badge>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {comp?.item && (
                                            <Badge variant="secondary" className="text-[10px] h-4 px-1 bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                                                {comp.item}
                                            </Badge>
                                        )}
                                        {comp?.ability && (
                                            <Badge variant="secondary" className="text-[10px] h-4 px-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                                {comp.ability}
                                            </Badge>
                                        )}
                                        {comp?.nature && (
                                            <Badge variant="secondary" className="text-[10px] h-4 px-1 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                                                {comp.nature}
                                            </Badge>
                                        )}
                                        {comp?.teraType && (
                                            <Badge variant="secondary" className="text-[10px] h-4 px-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                                                Tera: {comp.teraType}
                                            </Badge>
                                        )}
                                    </div>
                                    {comp?.moves && comp.moves.length > 0 && (
                                        <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                                            <Info className="h-3 w-3" />
                                            {comp.moves.length} Moves: {comp.moves.join(", ")}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {previewResult ? (
            <>
                <Button variant="outline" onClick={() => setPreviewResult(null)}>
                    Back to Edit
                </Button>
                <Button onClick={handleConfirmImport}>
                    Confirm Import
                </Button>
            </>
          ) : (
            <>
                <Button variant="outline" onClick={() => handleClose(false)} disabled={isLoading}>
                    Cancel
                </Button>
                <Button onClick={handlePreview} disabled={isLoading || !inputText.trim()}>
                    {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                    </>
                    ) : (
                    <>
                        Preview Team
                        <ChevronRight className="ml-1 h-4 w-4" />
                    </>
                    )}
                </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
