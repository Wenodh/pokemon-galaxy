import { PageLayout } from "@/components/layout/page-layout";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/page-header";
import { LivingDexDashboard } from "@/features/collections/components/LivingDexDashboard";

export const metadata = {
  title: "Living Pokédex | Pokémon Galaxy",
  description: "Browse, track, filter, and visualize your National and Regional Pokédex completion.",
};

export default function LivingDexPage() {
  return (
    <PageLayout>
      <Container>
        <div className="py-6 space-y-6">
          <PageHeader
            title="Living Pokédex"
            description="Track every Pokémon you have seen and caught across all generations and regions in a unified dashboard."
          />

          <LivingDexDashboard />
        </div>
      </Container>
    </PageLayout>
  );
}
