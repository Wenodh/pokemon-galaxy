import React from "react";
import { BattlePokemon } from "../domain/battle-types";
import { Button } from "../../../components/ui/button";

interface BattleControlsProps {
  isPlayerTurn: boolean;
  disabled?: boolean;
  activePokemon: BattlePokemon | undefined;
  team: BattlePokemon[];
  onAttack: (moveName: string, power: number) => void;
  onSwitch: (index: number) => void;
  onEndTurn: () => void;
}

export const BattleControls: React.FC<BattleControlsProps> = ({
  isPlayerTurn,
  disabled,
  activePokemon,
  team,
  onAttack,
  onSwitch,
  onEndTurn,
}) => {
  if (!activePokemon) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-background border rounded-xl shadow-lg">
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Attacks</h4>
        <div className="grid grid-cols-2 gap-2">
          <Button
            disabled={!isPlayerTurn || disabled || activePokemon.fainted}
            onClick={() => onAttack("Tackle", 40)}
            variant="default"
            className="h-12"
          >
            Tackle (40)
          </Button>
          <Button
            disabled={!isPlayerTurn || disabled || activePokemon.fainted}
            onClick={() => onAttack("Slam", 80)}
            variant="secondary"
            className="h-12"
          >
            Slam (80)
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Switch Pokémon</h4>
        <div className="flex flex-wrap gap-2">
          {team.map((p, idx) => (
            <Button
              key={`${p.id}-${idx}`}
              disabled={!isPlayerTurn || disabled || p.fainted || idx === team.indexOf(activePokemon)}
              onClick={() => onSwitch(idx)}
              variant="outline"
              size="sm"
              className={`h-10 px-3 ${p.fainted ? "opacity-50 grayscale" : ""}`}
            >
              <img src={p.image} alt={p.name} className="w-6 h-6 mr-2" />
              <span className="text-[10px] truncate max-w-[60px]">{p.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {!isPlayerTurn && !disabled && (
        <div className="col-span-full pt-2">
          <Button
            onClick={onEndTurn}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold"
          >
            Opponent Turn - Click to Continue
          </Button>
        </div>
      )}
    </div>
  );
};
