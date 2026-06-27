"use client";

import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

/**
 * Standard error display component
 */
export function ErrorMessage({
  title = "Error",
  message,
  onRetry,
  className,
}: ErrorMessageProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-lg border border-destructive/20 bg-destructive/5 p-8 text-center", className)}>
      <AlertCircle className="mb-4 h-10 w-10 text-destructive" />
      <h3 className="mb-2 text-lg font-bold text-destructive">{title}</h3>
      <p className="mb-6 max-w-md text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      )}
    </div>
  );
}
