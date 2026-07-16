import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const TrainerDashboard = dynamic(
  () => import("@/features/trainer/components/TrainerDashboard"),
  {
    loading: () => (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground animate-pulse">Loading Trainer Profile...</p>
      </div>
    ),
  }
);

export const metadata = {
  title: "Trainer Profile & Accomplishments | Pokemon Galaxy",
  description: "Display and manage your customizable trainer profile, review long-term statistics, progress milestones, and unlocked trophies.",
};

export default function TrainerPage() {
  return <TrainerDashboard />;
}
