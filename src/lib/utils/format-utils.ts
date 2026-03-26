/**
 * Format utilities for displaying data in user-friendly formats
 */

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
})

/**
 * Format a number as Vietnamese currency
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "100.000 ₫")
 * @example
 * formatCurrency(100000) // "100.000 ₫"
 */
export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount)
}

const countFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

/**
 * Format number to readable compact string
 * @param count - The number to format
 * @returns Formatted count string (e.g., "1.7K", "2.3M")
 * @example
 * formatCount(1700) // "1.7K"
 * formatCount(2300000) // "2.3M"
 */
export function formatCount(count: number): string {
  return countFormatter.format(count)
}
