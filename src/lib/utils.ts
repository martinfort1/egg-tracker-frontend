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

/**
 * Determines whether a fixed-day / recurring order should be visible.
 * Rule: Orders scheduled for fixed days should only appear starting from the day before delivery.
 * Before the day before delivery, they must not be visible.
 */
export function isOrderVisible(orderItem: any, now = new Date()): boolean {
  const order = orderItem?.order || orderItem;
  if (!order) return false;

  // Non-pending orders (fulfilled, cancelled) remain in historical logs
  if (order.status && order.status !== "PENDING") {
    return true;
  }

  const isFixedDay = Boolean(
    order.recurring || (Array.isArray(order.recurringDays) && order.recurringDays.length > 0)
  );

  // If it's a one-off order (not fixed-day/recurring), always visible
  if (!isFixedDay) {
    return true;
  }

  const orderDate = new Date(order.date);
  if (isNaN(orderDate.getTime())) return true;

  // Extract the target delivery date in UTC terms (as saved by DB)
  const dYear = orderDate.getUTCFullYear();
  const dMonth = orderDate.getUTCMonth();
  const dDay = orderDate.getUTCDate();

  // Day before delivery at 00:00:00 UTC
  const dayBeforeDeliveryUtc = Date.UTC(dYear, dMonth, dDay - 1);

  // Today in user's local day converted to UTC timestamp
  const todayUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());

  // Visible starting from the day before delivery (today >= dayBeforeDelivery)
  return todayUtc >= dayBeforeDeliveryUtc;
}

