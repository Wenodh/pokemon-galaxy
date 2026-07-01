"use client";

import { useState, useMemo } from "react";
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
import { TeamExporter } from "../domain/exporter";
import { Team } from "@/features/team/types/team.types";
import { useTeamPokemon } from "@/features/team/hooks/useTeamPokemon";
import { toast } from "sonner";
import { Copy, FileJson, FileText, Check } from "lucide-react";
import { copyToClipboard } from "../utils/clipboard";
import { PokemonListItem } from "@/features/pokedex/types";

interface ExportTeamDialogProps {
  team: Team | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExportTeamDialog({ team, open, onOpenChange }: ExportTeamDialogProps) {
  const [format, setFormat] = useState<"json" | "showdown">("json");
  const { team: fullTeam } = useTeamPokemon();
  const [copied, setCopied] = useState(false);

  const exportText = useMemo(() => {
    if (!team) return "";
    if (format === "json") {
        return TeamExporter.exportToJson(team);
    } else {
        const pokemonDetails = (fullTeam?.pokemonDetails as any as PokemonListItem[]) || [];
        return TeamExporter.exportToShowdown(team.name, pokemonDetails);
    }
  }, [team, format, fullTeam]);

  const handleCopy = async () => {
    const success = await copyToClipboard(exportText);
    if (success) {
        setCopied(true);
        toast.success(`Team exported and copied to clipboard as ${format.toUpperCase()}.`);
        setTimeout(() => setCopied(false), 2000);
    } else {
        toast.error("Failed to copy to clipboard.");
    }
  };

  if (!team) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Export Team</DialogTitle>
          <DialogDescription>
            Choose a format to export your team. The content will be copied to your clipboard.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex gap-2">
            <Button
                variant={format === "json" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setFormat("json")}
            >
                <FileJson className="mr-2 h-4 w-4" />
                JSON
            </Button>
            <Button
                variant={format === "showdown" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setFormat("showdown")}
            >
                <FileText className="mr-2 h-4 w-4" />
                Showdown
            </Button>
          </div>

          <div className="relative">
            <Textarea
              readOnly
              className="min-h-[200px] font-mono text-xs resize-none bg-muted/30"
              value={exportText}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={handleCopy} className="min-w-[140px]">
            {copied ? (
                <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied!
                </>
            ) : (
                <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy to Clipboard
                </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
