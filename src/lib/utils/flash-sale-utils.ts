import type { CountdownTime } from '@/lib/types/interfaces/apis/flash-sale.interfaces';

/**
 * Calculate remaining time until endTime
 */
export function calculateTimeRemaining(endTime: string): CountdownTime {
  const end = new Date(endTime).getTime();
  const now = Date.now();
  const diff = Math.max(0, end - now);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
}

/**
 * Pad single digit numbers with leading zero
 */
export function padZero(num: number): string {
  return num.toString().padStart(2, '0');
}

/**
 * Calculate discount percentage
 */
export function calculateDiscountPercent(
  originalPrice: number,
  flashPrice: number,
): number {
  if (originalPrice <= 0 || flashPrice >= originalPrice) return 0;
  return Math.round(((originalPrice - flashPrice) / originalPrice) * 100);
}

/**
 * Calculate remaining stock percentage
 */
export function calculateStockPercent(
  soldQuantity: number,
  maxQuantity: number,
): number {
  if (maxQuantity <= 0) return 0;
  return Math.max(0, ((maxQuantity - soldQuantity) / maxQuantity) * 100);
}

/**
 * Check if stock is low (less than 20% remaining)
 */
export function isLowStock(soldQuantity: number, maxQuantity: number): boolean {
  return calculateStockPercent(soldQuantity, maxQuantity) < 20;
}

/**
 * Check if product is sold out
 */
export function isSoldOut(soldQuantity: number, maxQuantity: number): boolean {
  return soldQuantity >= maxQuantity;
}

/**
 * Get remaining stock count
 */
export function getRemainingStock(
  soldQuantity: number,
  maxQuantity: number,
): number {
  return Math.max(0, maxQuantity - soldQuantity);
}
