import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamStats } from "../types/analysis.types";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface StatsCardProps {
  stats: TeamStats;
}

export function StatsCard({ stats }: StatsCardProps) {
  const statItems = [
    { label: "HP", value: stats.hp, color: "bg-red-500" },
    { label: "Attack", value: stats.attack, color: "bg-orange-500" },
    { label: "Defense", value: stats.defense, color: "bg-yellow-500" },
    { label: "Sp. Atk", value: stats.specialAttack, color: "bg-blue-500" },
    { label: "Sp. Def", value: stats.specialDefense, color: "bg-green-500" },
    { label: "Speed", value: stats.speed, color: "bg-pink-500" },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-bold">Average Team Stats</CardTitle>
        <Badge variant="secondary" className="font-mono font-bold">
          {stats.bst} BST
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {statItems.map((stat) => (
          <div key={stat.label} className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
              <span>{stat.label}</span>
              <span>{stat.value}</span>
            </div>
            <Progress
              value={stat.value}
              max={150}
              indicatorClassName={stat.color}
              className="h-2"
            />
          </div>
        ))}
        <p className="text-[10px] text-muted-foreground pt-2 italic">
          * Averages are calculated based on all Pokémon currently in the team.
        </p>
      </CardContent>
    </Card>
  );
}
