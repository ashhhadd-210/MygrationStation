import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with clsx and tailwind-merge.
 * Handles conditional classes and deduplication.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format cents to a dollar string. E.g., 14900 → "$149.00"
 */
export function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

/**
 * Format a date string for display.
 */
export function formatDate(
  dateString: string,
  locale: string = "en-US"
): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
}

/**
 * Format a date as relative time (e.g., "in 3 days", "2 days ago").
 */
export function formatRelativeDate(
  dateString: string,
  locale: string = "en-US"
): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (Math.abs(diffDays) < 1) {
    return rtf.format(0, "day");
  }
  if (Math.abs(diffDays) < 30) {
    return rtf.format(diffDays, "day");
  }
  if (Math.abs(diffDays) < 365) {
    return rtf.format(Math.round(diffDays / 30), "month");
  }
  return rtf.format(Math.round(diffDays / 365), "year");
}

/**
 * Mask sensitive values for display. E.g., "123456789" → "•••••6789"
 */
export function maskSensitive(value: string, visibleChars: number = 4): string {
  if (value.length <= visibleChars) return value;
  const masked = "•".repeat(value.length - visibleChars);
  return masked + value.slice(-visibleChars);
}

/**
 * Generate a URL-safe random string for share tokens etc.
 */
export function generateToken(length: number = 32): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}
