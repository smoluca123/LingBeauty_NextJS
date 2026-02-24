import { ICategoryDataType } from '@/lib/types/interfaces/apis/header.interfaces';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

export function formatCurrency(amount: number) {
  return currencyFormatter.format(amount);
}

/**
 * Recursively find a category by slug in a nested category tree.
 */
export function findCategoryBySlug(
  categories: ICategoryDataType[],
  slug: string,
): ICategoryDataType | null {
  for (const cat of categories) {
    if (cat.slug.toLowerCase() === slug.toLowerCase()) {
      return cat;
    }
    if (cat.children && cat.children.length > 0) {
      const found = findCategoryBySlug(cat.children, slug);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Format number to readable string (e.g. 1700 -> "1.7K")
 */

const countFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

export function formatCount(count: number): string {
  return countFormatter.format(count);
}
