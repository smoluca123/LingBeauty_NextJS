import { z } from 'zod'

/**
 * Search Schemas
 * Validation schemas for search forms
 */

export const searchSchema = z.object({
  search: z
    .string()
    .min(1, 'Vui lòng nhập từ khóa tìm kiếm')
    .max(100, 'Từ khóa tìm kiếm quá dài'),
})
