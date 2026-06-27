import { PageLayout } from "@/components/layout/page-layout";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { Clock } from "lucide-react";

export default function TeamBuilderPage() {
  return (
    <PageLayout>
      <Container>
        <PageHeader
          title="Team Builder"
          description="Build and optimize your ultimate Pokémon team."
        />
        <EmptyState
          title="Coming Soon"
          description="The Team Builder will be available in future phases."
          icon={<Clock className="h-6 w-6 text-muted-foreground" />}
        />
      </Container>
    </PageLayout>
  );
}
