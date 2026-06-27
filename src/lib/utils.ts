import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes with clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}

/**
 * Creates a debounced version of a function
 */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  };
}

/**
 * Suspends execution for a given amount of time
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Simple logger utility
 */
export const logger = {
  info: (message: string, data?: unknown) => {
    console.log(`[INFO] ${message}`, data || "");
  },
  error: (message: string, error?: unknown) => {
    console.error(`[ERROR] ${message}`, error || "");
  },
  warn: (message: string, data?: unknown) => {
    console.warn(`[WARN] ${message}`, data || "");
  },
};
