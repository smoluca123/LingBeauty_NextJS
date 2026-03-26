import { z } from 'zod'
import { FLASH_SALE_VALIDATION } from '@/app/admin/flash-sales/constants'

export const flashSaleCreateSchema = z.object({
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

export const flashSaleEditSchema = z.object({
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
  status: z.enum(['UPCOMING', 'ACTIVE', 'ENDED', 'CANCELLED']),
  isActive: z.boolean(),
  sortOrder: z.coerce.number().int().min(0),
})

export type FlashSaleCreateFormValues = z.infer<typeof flashSaleCreateSchema>
export type FlashSaleEditFormValues = z.infer<typeof flashSaleEditSchema>
