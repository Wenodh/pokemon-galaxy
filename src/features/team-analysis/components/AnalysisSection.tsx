import { cn } from "@/lib/utils";

interface AnalysisSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function AnalysisSection({
  title,
  description,
  children,
  className,
}: AnalysisSectionProps) {
  return (
    <section className={cn("space-y-4", className)}>
      <div className="space-y-1">
        <h3 className="text-lg font-bold tracking-tight">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}
