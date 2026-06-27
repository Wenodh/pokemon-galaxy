import { PageLayout } from "@/components/layout/page-layout";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Rocket } from "lucide-react";

export default function NotFound() {
  return (
    <PageLayout>
      <Container className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <Rocket className="mb-4 h-16 w-16 text-muted-foreground" />
        <h1 className="mb-2 text-4xl font-bold">404</h1>
        <p className="mb-8 text-xl text-muted-foreground">
          Oops! The page you&apos;re looking for has drifted out of orbit.
        </p>
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </Container>
    </PageLayout>
  );
}
