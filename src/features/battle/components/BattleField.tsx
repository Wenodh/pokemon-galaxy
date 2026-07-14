import React from "react";
import { BattlePokemonCard } from "./BattlePokemonCard";
import { BattlePokemon } from "../domain/battle-types";

interface BattleFieldProps {
  playerPokemon: BattlePokemon | undefined;
  opponentPokemon: BattlePokemon | undefined;
}

export const BattleField: React.FC<BattleFieldProps> = ({ playerPokemon, opponentPokemon }) => {
  return (
    <div className="relative w-full aspect-video md:aspect-[21/9] bg-gradient-to-b from-sky-300 to-emerald-400 rounded-2xl border-4 border-slate-800 shadow-2xl overflow-hidden mb-6 flex items-center justify-center">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grass.png')] opacity-20"></div>
      <div className="absolute bottom-0 w-full h-1/3 bg-emerald-600/30 blur-xl"></div>

      <div className="container relative z-10 grid grid-cols-2 h-full items-center px-8 md:px-16">
        {/* Player Side */}
        <div className="flex flex-col items-start gap-4 animate-in slide-in-from-left-8 duration-700">
          {playerPokemon && <BattlePokemonCard pokemon={playerPokemon} />}
        </div>

        {/* Opponent Side */}
        <div className="flex flex-col items-end gap-4 animate-in slide-in-from-right-8 duration-700">
          {opponentPokemon && <BattlePokemonCard pokemon={opponentPokemon} isOpponent />}
        </div>
      </div>

      {/* Versus Indicator */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-16 h-16 rounded-full bg-slate-900 border-4 border-yellow-500 flex items-center justify-center text-yellow-500 font-black text-2xl shadow-[0_0_20px_rgba(234,179,8,0.5)] italic">
          VS
        </div>
      </div>
    </div>
  );
};
