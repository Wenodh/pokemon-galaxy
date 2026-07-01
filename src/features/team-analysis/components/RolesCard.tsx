import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PokemonRole } from "../types/analysis.types";
import { ROLE_DESCRIPTIONS } from "../constants/analysis.constants";
import { Badge } from "@/components/ui/badge";
import { Shield, Zap, Sword, Heart, Activity } from "lucide-react";

interface RolesCardProps {
  roles: Record<string, PokemonRole>;
}

export function RolesCard({ roles }: RolesCardProps) {
  const roleEntries = Object.entries(roles);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold">Team Roles</CardTitle>
      </CardHeader>
      <CardContent>
        {roleEntries.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">No roles detected.</p>
        ) : (
          <div className="space-y-4">
            {roleEntries.map(([name, role]) => (
              <div key={name} className="flex flex-col gap-1 border-b last:border-0 pb-3 last:pb-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">{name}</span>
                  <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    {getRoleIcon(role)}
                    {role}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {ROLE_DESCRIPTIONS[role]}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function getRoleIcon(role: PokemonRole) {
  if (role.includes("Sweeper") || role.includes("Attacker")) return <Sword className="h-3 w-3" />;
  if (role.includes("Wall") || role === "Tank") return <Shield className="h-3 w-3" />;
  if (role === "Support") return <Heart className="h-3 w-3" />;
  if (role === "Fast Attacker") return <Zap className="h-3 w-3" />;
  return <Activity className="h-3 w-3" />;
}
