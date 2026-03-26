import { z } from 'zod'

/**
 * Review Schemas
 * Validation schemas for product review forms
 */

export const reviewFormSchema = z.object({
  productId: z.string('Product ID là bắt buộc'),
  rating: z
    .number()
    .min(1, 'Vui lòng chọn đánh giá')
    .max(5, 'Đánh giá tối đa 5 sao'),
  title: z.string().max(255, 'Tiêu đề tối đa 255 ký tự').optional(),
  comment: z.string().max(2000, 'Nội dung tối đa 2000 ký tự').optional(),
})
