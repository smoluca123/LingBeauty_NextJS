/**
 * Flash sale utilities for calculating time, discounts, and stock status
 */

import type { CountdownTime } from '@/lib/types/interfaces/apis/flash-sale.interfaces'

/**
 * Calculate remaining time until endTime
 * @param endTime - The end time as ISO string
 * @returns Object with days, hours, minutes, and seconds remaining
 */
export function calculateTimeRemaining(endTime: string): CountdownTime {
  const end = new Date(endTime).getTime()
  const now = Date.now()
  const diff = Math.max(0, end - now)

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds }
}

/**
 * Pad single digit numbers with leading zero
 * @param num - The number to pad
 * @returns String with leading zero if needed
 * @example
 * padZero(5) // "05"
 * padZero(12) // "12"
 */
export function padZero(num: number): string {
  return num.toString().padStart(2, '0')
}

/**
 * Calculate discount percentage between original and flash sale price
 * @param originalPrice - The original product price
 * @param flashPrice - The flash sale price
 * @returns Discount percentage (0-100)
 * @example
 * calculateDiscountPercent(100000, 80000) // 20
 * calculateDiscountPercent(100000, 100000) // 0
 */
export function calculateDiscountPercent(
  originalPrice: number,
  flashPrice: number,
): number {
  if (originalPrice <= 0 || flashPrice >= originalPrice) return 0
  return Math.round(((originalPrice - flashPrice) / originalPrice) * 100)
}

/**
 * Calculate remaining stock percentage
 * @param soldQuantity - Number of items sold
 * @param maxQuantity - Maximum quantity available
 * @returns Remaining stock percentage (0-100)
 * @example
 * calculateStockPercent(20, 100) // 80
 * calculateStockPercent(90, 100) // 10
 */
export function calculateStockPercent(
  soldQuantity: number,
  maxQuantity: number,
): number {
  if (maxQuantity <= 0) return 0
  return Math.max(0, ((maxQuantity - soldQuantity) / maxQuantity) * 100)
}

/**
 * Check if stock is low (less than 20% remaining)
 * @param soldQuantity - Number of items sold
 * @param maxQuantity - Maximum quantity available
 * @returns True if stock is below 20%
 * @example
 * isLowStock(85, 100) // true (15% remaining)
 * isLowStock(50, 100) // false (50% remaining)
 */
export function isLowStock(soldQuantity: number, maxQuantity: number): boolean {
  return calculateStockPercent(soldQuantity, maxQuantity) < 20
}

/**
 * Check if product is sold out
 * @param soldQuantity - Number of items sold
 * @param maxQuantity - Maximum quantity available
 * @returns True if sold quantity meets or exceeds max quantity
 * @example
 * isSoldOut(100, 100) // true
 * isSoldOut(101, 100) // true
 * isSoldOut(99, 100) // false
 */
export function isSoldOut(soldQuantity: number, maxQuantity: number): boolean {
  return soldQuantity >= maxQuantity
}

/**
 * Get remaining stock count
 * @param soldQuantity - Number of items sold
 * @param maxQuantity - Maximum quantity available
 * @returns Number of items remaining (minimum 0)
 * @example
 * getRemainingStock(30, 100) // 70
 * getRemainingStock(100, 100) // 0
 * getRemainingStock(110, 100) // 0
 */
export function getRemainingStock(
  soldQuantity: number,
  maxQuantity: number,
): number {
  return Math.max(0, maxQuantity - soldQuantity)
}
