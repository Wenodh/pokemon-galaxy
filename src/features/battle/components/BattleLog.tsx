import React, { useEffect, useRef } from "react";
import { BattleEvent } from "../domain/battle-types";

interface BattleLogProps {
  events: BattleEvent[];
}

export const BattleLog: React.FC<BattleLogProps> = ({ events }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 rounded-lg p-4 border shadow-inner overflow-hidden">
      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-800 pb-2">Battle Log</h4>
      <div
        ref={scrollRef}
        className="flex flex-col gap-2 overflow-y-auto scroll-smooth pr-2 custom-scrollbar h-64"
      >
        {events.map((event) => (
          <div key={event.id} className="text-sm border-l-2 border-slate-700 pl-3 py-1 animate-in fade-in slide-in-from-left-2">
            {event.type === "TURN_START" ? (
              <span className="font-bold text-yellow-500">{event.message}</span>
            ) : event.type === "VICTORY" ? (
              <span className="font-bold text-green-400 uppercase tracking-tighter">{event.message}</span>
            ) : (
              <span>{event.message}</span>
            )}
          </div>
        ))}
        {events.length === 0 && <p className="text-slate-500 italic text-center py-10">Waiting for battle to start...</p>}
      </div>
    </div>
  );
};
