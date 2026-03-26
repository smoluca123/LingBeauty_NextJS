import { z } from 'zod'

/**
 * Admin Schemas
 * Validation schemas for admin panel forms
 */

// ============ Banner Schemas ============

export const createBannerFormSchema = z.object({
  groupId: z.string().min(1, 'Vui lòng chọn nhóm banner').optional(),
  type: z.enum(['TEXT', 'IMAGE']),
  position: z.enum(['MAIN_CAROUSEL', 'SIDE_TOP', 'SIDE_BOTTOM']),
  badge: z.string().optional(),
  title: z.string().min(1, 'Vui lòng nhập tiêu đề'),
  description: z.string().optional(),
  highlight: z.string().optional(),
  ctaText: z.string().optional(),
  ctaLink: z.string().optional(),
  subLabel: z.string().optional(),
  gradientFrom: z.string().optional(),
  gradientTo: z.string().optional(),
  sortOrder: z.coerce.number().min(0),
  isActive: z.boolean(),
})

export const editBannerFormSchema = z.object({
  type: z.enum(['TEXT', 'IMAGE']),
  position: z.enum(['MAIN_CAROUSEL', 'SIDE_TOP', 'SIDE_BOTTOM']),
  badge: z.string().optional(),
  title: z.string().min(1, 'Vui lòng nhập tiêu đề'),
  description: z.string().optional(),
  highlight: z.string().optional(),
  ctaText: z.string().optional(),
  ctaLink: z.string().optional(),
  subLabel: z.string().optional(),
  gradientFrom: z.string().optional(),
  gradientTo: z.string().optional(),
  sortOrder: z.coerce.number().min(0),
  isActive: z.boolean(),
})

// ============ Banner Group Schemas ============

export const bannerGroupFormSchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập tên nhóm'),
  slug: z.string().min(1, 'Vui lòng nhập slug'),
  description: z.string().optional(),
  isActive: z.boolean(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

// ============ Flash Sale Schemas ============

// Validation constants
const FLASH_SALE_VALIDATION = {
  NAME_MIN_LENGTH: 3,
  NAME_MAX_LENGTH: 200,
  DESCRIPTION_MAX_LENGTH: 1000,
  SLUG_MIN_LENGTH: 3,
  SLUG_MAX_LENGTH: 100,
}

export const flashSaleFormSchema = z.object({
  name: z
    .string()
    .min(
      FLASH_SALE_VALIDATION.NAME_MIN_LENGTH,
      `Tên phải có ít nhất ${FLASH_SALE_VALIDATION.NAME_MIN_LENGTH} ký tự`,
    )
    .max(
      FLASH_SALE_VALIDATION.NAME_MAX_LENGTH,
      `Tên không được quá ${FLASH_SALE_VALIDATION.NAME_MAX_LENGTH} ký tự`,
    ),
  description: z
    .string()
    .max(
      FLASH_SALE_VALIDATION.DESCRIPTION_MAX_LENGTH,
      `Mô tả không được quá ${FLASH_SALE_VALIDATION.DESCRIPTION_MAX_LENGTH} ký tự`,
    )
    .optional(),
  slug: z
    .string()
    .min(
      FLASH_SALE_VALIDATION.SLUG_MIN_LENGTH,
      `Slug phải có ít nhất ${FLASH_SALE_VALIDATION.SLUG_MIN_LENGTH} ký tự`,
    )
    .max(
      FLASH_SALE_VALIDATION.SLUG_MAX_LENGTH,
      `Slug không được quá ${FLASH_SALE_VALIDATION.SLUG_MAX_LENGTH} ký tự`,
    )
    .regex(
      /^[a-z0-9-]+$/,
      'Slug chỉ được chứa chữ thường, số và dấu gạch ngang',
    ),
  startTime: z.string().min(1, 'Vui lòng chọn thời gian bắt đầu'),
  endTime: z.string().min(1, 'Vui lòng chọn thời gian kết thúc'),
  status: z.enum(['UPCOMING', 'ACTIVE', 'ENDED']),
  isActive: z.boolean(),
  sortOrder: z.coerce.number().int().min(0),
})

// ============ Coupon Schemas ============

// Validation constants
const COUPON_VALIDATION = {
  CODE_MIN_LENGTH: 3,
  CODE_MAX_LENGTH: 20,
  MIN_VALUE: 0,
}

export const couponFormSchema = z.object({
  code: z
    .string()
    .min(
      COUPON_VALIDATION.CODE_MIN_LENGTH,
      `Mã giảm giá phải có ít nhất ${COUPON_VALIDATION.CODE_MIN_LENGTH} ký tự`,
    )
    .max(
      COUPON_VALIDATION.CODE_MAX_LENGTH,
      `Mã giảm giá không được quá ${COUPON_VALIDATION.CODE_MAX_LENGTH} ký tự`,
    )
    .regex(
      /^[A-Z0-9_]+$/,
      'Mã giảm giá chỉ được chứa chữ hoa, số và dấu gạch dưới',
    ),
  type: z.enum(['FIXED', 'PERCENTAGE']),
  value: z.coerce
    .number()
    .min(COUPON_VALIDATION.MIN_VALUE, 'Giá trị giảm giá phải lớn hơn 0'),
  minPurchase: z.coerce.number().min(0).optional(),
  maxDiscount: z.coerce.number().min(0).optional(),
  usageLimit: z.coerce.number().min(1).optional(),
  startDate: z.string().min(1, 'Vui lòng chọn ngày bắt đầu'),
  endDate: z.string().min(1, 'Vui lòng chọn ngày kết thúc'),
  isActive: z.boolean(),
})
