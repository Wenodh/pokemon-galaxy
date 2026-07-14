import React from "react";
import { BattlePokemon } from "../domain/battle-types";
import { Progress } from "../../../components/ui/progress";

interface BattlePokemonCardProps {
  pokemon: BattlePokemon;
  isOpponent?: boolean;
}

export const BattlePokemonCard: React.FC<BattlePokemonCardProps> = ({ pokemon, isOpponent }) => {
  const hpPercentage = (pokemon.currentHp / pokemon.maxHp) * 100;

  return (
    <div className={`flex flex-col gap-2 p-4 rounded-lg bg-card border shadow-sm ${isOpponent ? "items-end text-right" : "items-start text-left"}`}>
      <div className="flex items-center gap-3">
        {!isOpponent && <img src={pokemon.image} alt={pokemon.name} className="w-16 h-16 object-contain" />}
        <div>
          <h3 className="font-bold text-lg">{pokemon.name}</h3>
          <p className="text-sm text-muted-foreground">Lv. {pokemon.level}</p>
        </div>
        {isOpponent && <img src={pokemon.image} alt={pokemon.name} className="w-16 h-16 object-contain" />}
      </div>

      <div className="w-full space-y-1">
        <div className="flex justify-between text-xs font-medium">
          <span>HP</span>
          <span>{Math.ceil(pokemon.currentHp)} / {pokemon.maxHp}</span>
        </div>
        <Progress value={hpPercentage} className="h-2" />
      </div>

      <div className="flex gap-1">
        {pokemon.types.map(type => (
          <span key={type} className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-primary/10 text-primary border border-primary/20">
            {type}
          </span>
        ))}
      </div>
    </div>
  );
};
