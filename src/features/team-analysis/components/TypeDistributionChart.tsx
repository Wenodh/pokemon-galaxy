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
  // Map type names to their CSS classes for colors if needed,
  // or just use a generic color for the bars.

  const data = distribution.map(d => ({
    name: d.type.charAt(0).toUpperCase() + d.type.slice(1),
    count: d.count,
    rawType: d.type
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold">Type Composition</CardTitle>
        <CardDescription>
          Frequency of types across all team members (primary and secondary).
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[350px]">
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
      </CardContent>
    </Card>
  );
}
