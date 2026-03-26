import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ============================================================
// CLASS MERGING
// ============================================================

/**
 * Merges Tailwind CSS class names intelligently, resolving conflicts.
 * Uses clsx for conditional logic and tailwind-merge for deduplication.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ============================================================
// PRICE FORMATTING
// ============================================================

/**
 * Formats a numeric price into a USD currency string.
 * @param amount - Price in dollars (e.g. 149.99)
 * @param currency - ISO 4217 currency code (default: "USD")
 * @param locale - BCP 47 locale tag (default: "en-US")
 */
export function formatPrice(
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Returns the discount percentage between a compare price and sale price.
 * @param comparePrice - Original / MSRP price
 * @param salePrice - Current sale price
 */
export function getDiscountPercent(
  comparePrice: number,
  salePrice: number
): number {
  if (comparePrice <= 0 || salePrice >= comparePrice) return 0;
  return Math.round(((comparePrice - salePrice) / comparePrice) * 100);
}

// ============================================================
// SLUGIFY
// ============================================================

/**
 * Converts a string into a URL-safe slug.
 * e.g. "Air Max 270 – Black/Red" → "air-max-270-black-red"
 */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")                        // normalize unicode
    .replace(/[\u0300-\u036f]/g, "")           // strip diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")             // remove non-alphanumeric except spaces/hyphens
    .replace(/[\s_-]+/g, "-")                  // collapse whitespace and underscores to hyphens
    .replace(/^-+|-+$/g, "");                  // trim leading/trailing hyphens
}

// ============================================================
// ORDER NUMBERS
// ============================================================

/**
 * Generates a human-readable, unique order number.
 * Format: ACR-YYYYMMDD-XXXXX (e.g. ACR-20270315-A3B7K)
 */
export function generateOrderNumber(): string {
  const now = new Date();
  const datePart = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");

  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I, O, 0, 1 for clarity
  let random = "";
  for (let i = 0; i < 5; i++) {
    random += chars[Math.floor(Math.random() * chars.length)];
  }

  return `ACR-${datePart}-${random}`;
}

// ============================================================
// GENERAL HELPERS
// ============================================================

/**
 * Returns true if a value is non-null and non-undefined.
 * Useful as a type-guard in .filter() calls.
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Truncates a string to the given maximum length, appending an ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3).trimEnd() + "...";
}

/**
 * Converts a snake_case or kebab-case string to Title Case.
 */
export function toTitleCase(str: string): string {
  return str
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Pauses execution for a given number of milliseconds.
 * Useful in async functions for retry back-off.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Clamps a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Formats a Date object as a human-friendly string.
 * e.g. "March 15, 2027"
 */
export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  },
  locale: string = "en-US"
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options).format(d);
}

/**
 * Returns a relative time string.
 * e.g. "3 days ago", "in 2 hours"
 */
export function timeAgo(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const seconds = Math.round((now.getTime() - d.getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const thresholds: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, "second"],
    [3600, "minute"],
    [86400, "hour"],
    [2592000, "day"],
    [31536000, "month"],
    [Infinity, "year"],
  ];

  let prev = 1;
  for (const [threshold, unit] of thresholds) {
    if (Math.abs(seconds) < threshold) {
      return rtf.format(-Math.round(seconds / prev), unit);
    }
    prev = threshold;
  }

  return rtf.format(-Math.round(seconds / 31536000), "year");
}

/**
 * Capitalizes the first letter of a string.
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Groups an array of objects by a key.
 */
export function groupBy<T>(
  items: T[],
  key: keyof T
): Record<string, T[]> {
  return items.reduce(
    (acc, item) => {
      const groupKey = String(item[key]);
      if (!acc[groupKey]) acc[groupKey] = [];
      acc[groupKey]!.push(item);
      return acc;
    },
    {} as Record<string, T[]>
  );
}
