import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalysisWarning } from "../types/analysis.types";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface WarningsCardProps {
  warnings: AnalysisWarning[];
}

export function WarningsCard({ warnings }: WarningsCardProps) {
  const sortedWarnings = [...warnings].sort((a, b) => {
    const priority = { high: 0, medium: 1, low: 2 };
    return priority[a.severity] - priority[b.severity];
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold">Team Warnings</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedWarnings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <p className="text-sm font-bold">No Major Issues</p>
            <p className="text-xs text-muted-foreground">Your team balance looks solid.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedWarnings.map((w, i) => (
              <div
                key={i}
                className={cn(
                  "flex gap-3 p-3 rounded-lg border text-sm",
                  w.severity === "high" ? "bg-red-50 border-red-100 dark:bg-red-900/10 dark:border-red-900/30" :
                  w.severity === "medium" ? "bg-orange-50 border-orange-100 dark:bg-orange-900/10 dark:border-orange-900/30" :
                  "bg-blue-50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/30"
                )}
              >
                <div className="mt-0.5">
                  {w.severity === "high" ? <AlertCircle className="h-4 w-4 text-red-500" /> :
                   w.severity === "medium" ? <AlertTriangle className="h-4 w-4 text-orange-500" /> :
                   <Info className="h-4 w-4 text-blue-500" />}
                </div>
                <div className="space-y-1">
                  <p className={cn(
                    "font-bold text-xs uppercase tracking-wider",
                    w.severity === "high" ? "text-red-600 dark:text-red-400" :
                    w.severity === "medium" ? "text-orange-600 dark:text-orange-400" :
                    "text-blue-600 dark:text-blue-400"
                  )}>
                    {w.severity} Priority
                  </p>
                  <p className="font-medium leading-tight text-foreground/80">{w.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
