"use client";

import { useEffect } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageLayout>
      <Container className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <AlertCircle className="mb-4 h-16 w-16 text-destructive" />
        <h1 className="mb-2 text-4xl font-bold">Something went wrong</h1>
        <p className="mb-8 text-xl text-muted-foreground">
          {error.message || "An unexpected error occurred."}
        </p>
        <div className="flex gap-4">
          <Button onClick={() => reset()}>Try again</Button>
          <Button variant="outline" asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </Container>
    </PageLayout>
  );
}
