import { PageLayout } from "@/components/layout/page-layout";
import { Container } from "@/components/common/container";
import { LoadingSpinner } from "@/components/common/loading-spinner";

export default function Loading() {
  return (
    <PageLayout>
      <Container className="flex min-h-[60vh] flex-col items-center justify-center">
        <LoadingSpinner size={48} />
        <p className="mt-4 text-muted-foreground animate-pulse">
          Loading the galaxy...
        </p>
      </Container>
    </PageLayout>
  );
}
