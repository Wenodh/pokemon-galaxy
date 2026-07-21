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
import { Label } from "@/components/ui/label";
import { TeamExporter } from "../domain/exporter";
import { Team } from "@/features/team/types/team.types";
import { useTeamPokemon } from "@/features/team/hooks/useTeamPokemon";
import { toast } from "sonner";
import { Copy, FileJson, FileText, Check, Download } from "lucide-react";
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
        return TeamExporter.exportToShowdown(team.name, pokemonDetails, team.competitive);
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

  const handleDownload = () => {
      if (!team) return;

      const filename = format === "json"
        ? `${TeamExporter.getSanitizedFilename(team.name).replace(".txt", "")}.json`
        : TeamExporter.getSanitizedFilename(team.name);

      const blob = new Blob([exportText], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`Downloaded as ${filename}`);
  };

  if (!team) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Export Team</DialogTitle>
          <DialogDescription>
            Choose a format to export your team. You can copy the text or download it as a file.
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
            <Label htmlFor="export-team-data" className="sr-only">Exported team data</Label>
            <Textarea
              id="export-team-data"
              readOnly
              className="min-h-[250px] font-mono text-xs resize-none bg-muted/30 p-4"
              value={exportText}
            />
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 sm:justify-between">
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={handleDownload} className="flex-1 sm:flex-none">
                <Download className="mr-2 h-4 w-4" />
                Download
            </Button>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="ghost" onClick={() => onOpenChange(false)} className="flex-1 sm:flex-none">
                Close
            </Button>
            <Button onClick={handleCopy} className="flex-1 sm:flex-none min-w-[140px]">
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
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
