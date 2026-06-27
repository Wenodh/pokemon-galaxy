"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import * as React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Rocket } from "lucide-react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});

function ErrorFallback({ error, resetErrorBoundary }: any) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <Rocket className="mb-4 h-12 w-12 text-destructive" />
      <h2 className="mb-2 text-2xl font-bold">Something went wrong</h2>
      <p className="mb-6 max-w-md text-muted-foreground">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <button
        onClick={resetErrorBoundary}
        className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <NextThemesProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </NextThemesProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
