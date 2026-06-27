import { PageLayout } from "@/components/layout/page-layout";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { Clock } from "lucide-react";

export default function QuizPage() {
  return (
    <PageLayout>
      <Container>
        <PageHeader
          title="Pokémon Quiz"
          description="Test your knowledge of the Pokémon world."
        />
        <EmptyState
          title="Coming Soon"
          description="The Pokémon Quiz will be available in future phases."
          icon={<Clock className="h-6 w-6 text-muted-foreground" />}
        />
      </Container>
    </PageLayout>
  );
}
