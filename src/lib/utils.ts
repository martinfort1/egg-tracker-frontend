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

/**
 * Formats a number using Argentine locale (es-AR)
 * @param value - Number to format
 * @param options - Intl.NumberFormatOptions
 * @returns Formatted number string
 */
export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat("es-AR", options).format(value);
}

/**
 * Formats a currency value in Argentine pesos
 * @param value - Number to format as currency
 * @returns Formatted currency string with $ prefix
 */
export function formatCurrency(value: number): string {
  return `$${formatNumber(value)}`;
}
