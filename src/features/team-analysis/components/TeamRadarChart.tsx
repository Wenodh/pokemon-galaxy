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

  const summaryText = `This chart illustrates the average base stats of your team across six key categories: HP (${stats.hp.toFixed(1)}), Attack (${stats.attack.toFixed(1)}), Defense (${stats.defense.toFixed(1)}), Special Attack (${stats.specialAttack.toFixed(1)}), Special Defense (${stats.specialDefense.toFixed(1)}), and Speed (${stats.speed.toFixed(1)}). These averages help identify your team's overall strengths and attributes.`;

  return (
    <Card className="overflow-hidden" aria-label="Average Stats Profile Chart Container">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Average Stats Profile</CardTitle>
        <CardDescription>
          Comparison of the team's average stats against the maximum potential (255).
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="h-[300px]" role="img" aria-label="Radar chart showing the team's average stats profile: HP, Attack, Defense, Sp. Atk, Sp. Def, and Speed.">
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
        </div>

        {/* Textual summary immediately below the chart */}
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          {summaryText}
        </p>

        {/* Collapsible View Data Table */}
        <details className="mt-4 border border-border/50 rounded-lg p-2.5 bg-muted/10 group">
          <summary className="text-xs font-bold cursor-pointer select-none hover:text-primary transition-colors focus:outline-none focus:underline focus:ring-1 focus:ring-ring focus:ring-offset-1 rounded px-1.5 py-1">
            View Data Table <span className="sr-only">for average stats profile</span>
          </summary>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <caption className="sr-only">Average stats values and maximum possible values</caption>
              <thead>
                <tr className="border-b border-border/60">
                  <th scope="col" className="py-2 font-black">Stat Category</th>
                  <th scope="col" className="py-2 text-right font-black">Average Value</th>
                  <th scope="col" className="py-2 text-right font-black">Max Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {data.map((row) => (
                  <tr key={row.subject} className="hover:bg-muted/30">
                    <th scope="row" className="py-2 font-medium capitalize">{row.subject}</th>
                    <td className="py-2 text-right font-mono">{row.A.toFixed(1)}</td>
                    <td className="py-2 text-right font-mono">{row.fullMark}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </CardContent>
    </Card>
  );
}
