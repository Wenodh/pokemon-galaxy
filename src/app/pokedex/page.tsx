import { PageLayout } from "@/components/layout/page-layout";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { Clock } from "lucide-react";

export default function PokedexPage() {
  return (
    <PageLayout>
      <Container>
        <PageHeader
          title="Pokédex"
          description="Browse and filter through the entire Pokémon universe."
        />
        <EmptyState
          title="Coming Soon"
          description="The Pokédex is currently under construction and will be available in Phase 1."
          icon={<Clock className="h-6 w-6 text-muted-foreground" />}
        />
      </Container>
    </PageLayout>
  );
}
