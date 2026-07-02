"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { PokemonRole } from "../types/analysis.types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StatComparisonChartProps {
  members: (any & { role: PokemonRole })[];
}

const STATS_CONFIG = [
  { key: "hp", label: "HP", color: "#ef4444" },
  { key: "attack", label: "Attack", color: "#f97316" },
  { key: "defense", label: "Defense", color: "#eab308" },
  { key: "special-attack", label: "Sp. Atk", color: "#3b82f6" },
  { key: "special-defense", label: "Sp. Def", color: "#22c55e" },
  { key: "speed", label: "Speed", color: "#ec4899" },
];

export function StatComparisonChart({ members }: StatComparisonChartProps) {
  const [selectedStat, setSelectedStat] = useState("hp");

  const chartData = members.map(m => {
    const statValue = m.stats?.find((s: any) => s.name.toLowerCase() === selectedStat)?.value || 0;
    return {
      name: m.name,
      value: statValue,
      role: m.role
    };
  });

  const activeConfig = STATS_CONFIG.find(c => c.key === selectedStat);

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-lg font-bold">Member Comparison</CardTitle>
            <Tabs value={selectedStat} onValueChange={setSelectedStat} className="w-full sm:w-auto">
                <TabsList className="grid grid-cols-3 sm:flex h-auto p-1 bg-muted/50">
                    {STATS_CONFIG.map(stat => (
                        <TabsTrigger
                            key={stat.key}
                            value={stat.key}
                            className="text-[10px] sm:text-xs px-2 py-1"
                        >
                            {stat.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
        </div>
        <CardDescription>
          Compare {activeConfig?.label} across all team members to identify strengths and outliers.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
                dataKey="name"
                tick={{ fill: "currentColor", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
            />
            <YAxis
                domain={[0, 255]}
                tick={{ fill: "currentColor", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
            />
            <Tooltip
                cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px"
                }}
            />
            <Bar
                dataKey="value"
                name={activeConfig?.label}
                fill={activeConfig?.color}
                radius={[4, 4, 0, 0]}
                animationDuration={1000}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
