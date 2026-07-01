import { Skeleton } from "@/components/ui/skeleton";

export function ChartSkeleton() {
  return (
    <div className="flex flex-col space-y-4 w-full h-[300px] p-6 bg-card rounded-xl border animate-pulse">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-6 w-24" />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <Skeleton className="h-full w-full rounded-lg" />
      </div>
      <div className="flex justify-center space-x-4">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}
