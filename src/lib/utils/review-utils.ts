/**
 * Review-related utility functions
 * Shared across review components
 */

/**
 * Get Tailwind color class based on rating value
 * @param rating - Rating value (1-5)
 * @returns Tailwind color class
 */
export function getRatingColorClass(rating: number): string {
  if (rating >= 4) return 'text-green-600'
  if (rating >= 3) return 'text-yellow-600'
  return 'text-red-600'
}

/**
 * Get rating badge variant based on rating value
 * @param rating - Rating value (1-5)
 * @returns Badge variant
 */
export function getRatingBadgeVariant(
  rating: number,
): 'default' | 'secondary' | 'destructive' {
  if (rating >= 4) return 'default'
  if (rating >= 3) return 'secondary'
  return 'destructive'
}

/**
 * Format rating display text
 * @param rating - Rating value
 * @param maxRating - Maximum rating (default: 5)
 * @returns Formatted rating text (e.g., "4.5/5")
 */
export function formatRating(rating: number, maxRating = 5): string {
  return `${rating}/${maxRating}`
}
