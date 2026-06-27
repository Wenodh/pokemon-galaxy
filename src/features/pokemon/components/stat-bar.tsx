"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
interface StatBarProps { label: string; value: number; max?: number; color?: string; className?: string; }
const statColors: Record<string, string> = { hp: "bg-emerald-500", attack: "bg-red-500", defense: "bg-blue-500", "special-attack": "bg-purple-500", "special-defense": "bg-green-500", speed: "bg-pink-500", };
const statLabels: Record<string, string> = { hp: "HP", attack: "Attack", defense: "Defense", "special-attack": "Sp. Atk", "special-defense": "Sp. Def", speed: "Speed", };
export function StatBar({ label, value, max = 255, color, className }: StatBarProps) {
  const percentage = Math.min(100, (value / max) * 100);
  const barColor = color || statColors[label.toLowerCase()] || "bg-primary";
  const displayLabel = statLabels[label.toLowerCase()] || label;
  return (
    <div className={cn("group flex flex-col gap-1.5", className)}>
      <div className="flex justify-between text-xs font-medium uppercase tracking-wider">
        <span className="text-muted-foreground">{displayLabel}</span>
        <span className="font-mono font-bold text-foreground">{value}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary/50">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn("h-full rounded-full transition-all group-hover:brightness-110", barColor)}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={`${displayLabel}: ${value}`}
        />
      </div>
    </div>
  );
}
