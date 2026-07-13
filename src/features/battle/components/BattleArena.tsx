import React from "react";
import { BattleField } from "./BattleField";
import { BattleControls } from "./BattleControls";
import { BattleLog } from "./BattleLog";
import { useBattle } from "../application/useBattle";
import { Button } from "../../../components/ui/button";

export const BattleArena: React.FC = () => {
  const {
    battle,
    playerPokemon,
    opponentPokemon,
    isPlayerTurn,
    status,
    winner,
    initializeBattle,
    playerAttack,
    playerSwitch,
    endTurn,
    resetBattle,
  } = useBattle();

  // Mock initial battle for demonstration
  const startDemoBattle = () => {
    const pTeam: any[] = [
      {
        id: 25,
        name: "Pikachu",
        level: 50,
        maxHp: 120,
        currentHp: 120,
        stats: { hp: 120, atk: 110, def: 90, spa: 100, spd: 100, spe: 150 },
        types: ["Electric"],
        image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
        fainted: false,
        status: "NONE",
        statusTurns: 0,
        ability: "Static",
        item: "Life Orb",
        statChanges: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }
      },
      {
        id: 1,
        name: "Bulbasaur",
        level: 50,
        maxHp: 140,
        currentHp: 140,
        stats: { hp: 140, atk: 95, def: 110, spa: 120, spd: 120, spe: 90 },
        types: ["Grass", "Poison"],
        image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
        fainted: false,
        status: "NONE",
        statusTurns: 0,
        ability: "Overgrow",
        item: "Leftovers",
        statChanges: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }
      }
    ];

    const oTeam: any[] = [
      {
        id: 4,
        name: "Charmander",
        level: 50,
        maxHp: 120,
        currentHp: 120,
        stats: { hp: 120, atk: 120, def: 85, spa: 110, spd: 100, spe: 130 },
        types: ["Fire"],
        image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
        fainted: false,
        status: "NONE",
        statusTurns: 0,
        ability: "Blaze",
        item: "Focus Sash",
        statChanges: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }
      },
      {
        id: 7,
        name: "Squirtle",
        level: 50,
        maxHp: 135,
        currentHp: 135,
        stats: { hp: 135, atk: 100, def: 140, spa: 100, spd: 140, spe: 85 },
        types: ["Water"],
        image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",
        fainted: false,
        status: "NONE",
        statusTurns: 0,
        ability: "Torrent",
        item: "Rocky Helmet",
        statChanges: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }
      }
    ];

    initializeBattle(pTeam, oTeam);
  };

  if (!battle) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
        <div className="space-y-2">
          <h2 className="text-3xl font-black tracking-tight">Battle Simulator</h2>
          <p className="text-muted-foreground max-w-md">Test your team in a deterministic battle foundation. No randomness, just strategy.</p>
        </div>
        <Button onClick={startDemoBattle} size="lg" className="px-12 font-bold text-lg h-14">Start Training Battle</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tighter italic">Battle Arena</h2>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Turn {battle.currentTurn} • {status}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={resetBattle} className="text-muted-foreground hover:text-destructive">Surrender</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <BattleField
            playerPokemon={playerPokemon}
            opponentPokemon={opponentPokemon}
          />

          <BattleControls
            isPlayerTurn={isPlayerTurn}
            disabled={status !== "ONGOING"}
            activePokemon={playerPokemon}
            team={battle.state.player.team}
            onAttack={playerAttack}
            onSwitch={playerSwitch}
            onEndTurn={endTurn}
          />

          {status !== "ONGOING" && (
            <div className={`p-8 rounded-2xl border-4 text-center space-y-4 animate-bounce shadow-2xl ${winner === "PLAYER" ? "bg-green-100 border-green-500 text-green-700" : "bg-red-100 border-red-500 text-red-700"}`}>
              <h3 className="text-5xl font-black uppercase italic tracking-tighter">
                {winner === "PLAYER" ? "Victory!" : "Defeat!"}
              </h3>
              <p className="font-bold text-lg">{winner === "PLAYER" ? "You've defeated the opponent team!" : "Your team was wiped out."}</p>
              <Button onClick={resetBattle} variant={winner === "PLAYER" ? "default" : "destructive"} className="px-10 h-12 font-bold">Return to Lobby</Button>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <BattleLog events={battle.log} />
        </div>
      </div>
    </div>
  );
};
