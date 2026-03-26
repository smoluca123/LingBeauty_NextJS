import type { ICategoryDataType } from '@/lib/types/interfaces/apis/header.interfaces'

/**
 * Recursively find a category by slug in a nested category tree
 * @param categories - Array of categories to search through
 * @param slug - The slug to search for
 * @returns The found category or null if not found
 * @example
 * const category = findCategoryBySlug(categories, "electronics");
 */
export function findCategoryBySlug(
  categories: ICategoryDataType[],
  slug: string,
): ICategoryDataType | null {
  for (const cat of categories) {
    if (cat.slug.toLowerCase() === slug.toLowerCase()) {
      return cat
    }
    if (cat.children && cat.children.length > 0) {
      const found = findCategoryBySlug(cat.children, slug)
      if (found) return found
    }
  }
  return null
}
