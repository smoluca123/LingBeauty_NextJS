import slugify from 'slugify'

/**
 * Generate slug from text
 */
export function generateSlug(text: string): string {
  return slugify(text, {
    lower: true,
  })
}
