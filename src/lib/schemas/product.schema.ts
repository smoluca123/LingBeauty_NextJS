import { z } from 'zod'

/**
 * Product Schemas
 * Validation schemas for product-related forms
 */

export const productFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Tên sản phẩm là bắt buộc')
    .max(200, 'Tên sản phẩm tối đa 200 ký tự'),
  slug: z.string().max(200, 'Slug tối đa 200 ký tự').optional(),
  sku: z.string().max(50, 'SKU tối đa 50 ký tự').optional(),
  shortDesc: z.string().max(500, 'Mô tả ngắn tối đa 500 ký tự').optional(),
  categoryId: z.string().min(1, 'Vui lòng chọn danh mục'),
  brandId: z.string().min(1, 'Vui lòng chọn thương hiệu'),
  basePrice: z
    .number()
    .min(0, 'Giá bán phải lớn hơn hoặc bằng 0')
    .max(999999999, 'Giá bán quá lớn'),
  comparePrice: z
    .number()
    .min(0, 'Giá so sánh phải lớn hơn hoặc bằng 0')
    .optional(),
  stock: z
    .number()
    .min(0, 'Số lượng tồn kho phải lớn hơn hoặc bằng 0')
    .optional()
    .default(0),
  lowStockThreshold: z
    .number()
    .min(0, 'Ngưỡng cảnh báo phải lớn hơn hoặc bằng 0')
    .optional()
    .default(10),
  isActive: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
})

export const createQuestionSchema = z.object({
  question: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập câu hỏi')
    .max(500, 'Câu hỏi không được vượt quá 500 ký tự'),
})

export const updateQuestionSchema = z.object({
  question: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập câu hỏi')
    .max(500, 'Câu hỏi không được vượt quá 500 ký tự'),
})

export const answerQuestionSchema = z.object({
  answer: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập câu trả lời')
    .max(1000, 'Câu trả lời không được vượt quá 1000 ký tự'),
  answeredBy: z.string().uuid('ID admin không hợp lệ').optional(),
})

export type ProductFormValues = z.infer<typeof productFormSchema>
export type CreateQuestionValues = z.infer<typeof createQuestionSchema>
export type UpdateQuestionValues = z.infer<typeof updateQuestionSchema>
export type AnswerQuestionValues = z.infer<typeof answerQuestionSchema>
