"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * A lightweight Tooltip component.
 * Note: In a full project, this would use @radix-ui/react-tooltip.
 * For this phase, we use a simple CSS-based or title-based implementation
 * to keep it lightweight as requested.
 */
export function Tooltip({ content, children, className }: TooltipProps) {
  return (
    <div className={cn("group relative inline-block", className)}>
      {children}
      <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-max max-w-xs -translate-x-1/2 rounded bg-popover px-2 py-1 text-xs text-popover-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100 z-50 border">
        {content}
        <div className="absolute top-full left-1/2 -mt-1 -translate-x-1/2 border-4 border-transparent border-t-popover" />
      </div>
    </div>
  );
}
