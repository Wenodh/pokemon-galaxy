"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";
import { QueryProvider } from "./query-provider";
import { AuthProvider } from "@/features/cloud-sync/components/auth-provider";
import { SyncQueueProcessor } from "@/features/cloud-sync/components/sync-queue-processor";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { ErrorMessage } from "@/components/common/error-message";

interface RootProviderProps {
  children: ReactNode;
}

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 text-center">
      <ErrorMessage
        title="Application Error"
        message={error instanceof Error ? error.message : "An unexpected error occurred"}
        onRetry={resetErrorBoundary}
      />
    </div>
  );
}

/**
 * Consolidates all application-wide providers
 */
export function RootProvider({ children }: RootProviderProps) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AuthProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
            <SyncQueueProcessor />
          </QueryProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
