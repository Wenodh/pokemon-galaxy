"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import { TeamStats } from "../types/analysis.types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface TeamRadarChartProps {
  stats: TeamStats;
}

export function TeamRadarChart({ stats }: TeamRadarChartProps) {
  const data = [
    { subject: "HP", A: stats.hp, fullMark: 255 },
    { subject: "Attack", A: stats.attack, fullMark: 255 },
    { subject: "Defense", A: stats.defense, fullMark: 255 },
    { subject: "Sp. Atk", A: stats.specialAttack, fullMark: 255 },
    { subject: "Sp. Def", A: stats.specialDefense, fullMark: 255 },
    { subject: "Speed", A: stats.speed, fullMark: 255 },
  ];

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Average Stats Profile</CardTitle>
        <CardDescription>
          Comparison of the team's average stats against the maximum potential (255).
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] pb-6">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: "currentColor", fontSize: 12, fontWeight: 600 }}
            />
            <PolarRadiusAxis
                angle={30}
                domain={[0, 255]}
                tick={false}
                axisLine={false}
            />
            <Radar
              name="Average Stats"
              dataKey="A"
              stroke="var(--color-primary, #3b82f6)"
              fill="var(--color-primary, #3b82f6)"
              fillOpacity={0.6}
            />
            <Tooltip
                contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px"
                }}
                itemStyle={{ color: "hsl(var(--popover-foreground))" }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
