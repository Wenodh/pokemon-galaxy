"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";
import { TypeCount } from "../types/analysis.types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TypeDistributionChartProps {
  distribution: TypeCount[];
}

export function TypeDistributionChart({ distribution }: TypeDistributionChartProps) {
  const data = distribution.map(d => ({
    name: d.type.charAt(0).toUpperCase() + d.type.slice(1),
    count: d.count,
    rawType: d.type
  }));

  // Create highly accessible descriptive summary text
  const summaryText = data.length > 0
    ? `This chart displays the type composition of your team. The distribution includes: ` +
      data.map(d => `${d.name} (present on ${d.count} member${d.count === 1 ? "" : "s"})`).join(", ") + "."
    : "No types currently represented in the team.";

  return (
    <Card aria-label="Type Composition Chart Container">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Type Composition</CardTitle>
        <CardDescription>
          Frequency of types across all team members (primary and secondary).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-[350px]" role="img" aria-label="Horizontal bar chart showing the frequency of different Pokémon types represented across your team.">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={data}
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
              <XAxis type="number" hide />
              <YAxis
                  type="category"
                  dataKey="name"
                  width={70}
                  tick={{ fill: "currentColor", fontSize: 11, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
              />
              <Tooltip
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px"
                  }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                  {data.map((entry, index) => (
                      <Cell
                          key={`cell-${index}`}
                          className={cn(`fill-type-${entry.rawType}`)}
                          style={{ fill: `var(--type-${entry.rawType}-color)` }}
                      />
                  ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Textual summary immediately below the chart */}
        <p className="text-xs leading-relaxed text-muted-foreground">
          {summaryText}
        </p>

        {/* Collapsible View Data Table */}
        <details className="border border-border/50 rounded-lg p-2.5 bg-muted/10 group">
          <summary className="text-xs font-bold cursor-pointer select-none hover:text-primary transition-colors focus:outline-none focus:underline focus:ring-1 focus:ring-ring focus:ring-offset-1 rounded px-1.5 py-1">
            View Data Table <span className="sr-only">for type composition</span>
          </summary>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <caption className="sr-only">Pokémon types represented in the team and their frequency counts</caption>
              <thead>
                <tr className="border-b border-border/60">
                  <th scope="col" className="py-2 font-black">Pokémon Type</th>
                  <th scope="col" className="py-2 text-right font-black">Representation Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {data.map((row) => (
                  <tr key={row.rawType} className="hover:bg-muted/30">
                    <th scope="row" className="py-2 font-medium capitalize">{row.name}</th>
                    <td className="py-2 text-right font-mono font-bold">{row.count}</td>
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr>
                    <td colSpan={2} className="py-4 text-center text-muted-foreground">
                      No types are currently represented in the team.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </details>
      </CardContent>
    </Card>
  );
}
