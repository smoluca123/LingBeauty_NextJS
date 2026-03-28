import clsx, { ClassValue } from 'clsx'
import slugify from 'slugify'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Generate slug from text
 */
export function generateSlug(text: string): string {
  return slugify(text, {
    lower: true,
  })
}
