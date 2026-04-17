import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date to DD/MM/YYYY using UTC timezone
 * @param value - Date string or Date object
 * @returns Formatted date string in DD/MM/YYYY format
 */
export function formatUtcDate(value: string | Date): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  return `${String(date.getUTCDate()).padStart(2, '0')}/${String(date.getUTCMonth() + 1).padStart(2, '0')}/${date.getUTCFullYear()}`;
}
