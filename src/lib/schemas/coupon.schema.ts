import { z } from 'zod'
import { COUPON_VALIDATION } from '@/app/admin/coupons/constants'

export const couponSchema = z.object({
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
    .number<number>()
    .min(COUPON_VALIDATION.MIN_VALUE, 'Giá trị giảm giá phải lớn hơn 0'),
  minPurchase: z.coerce.number<number>().min(0).optional(),
  maxDiscount: z.coerce.number<number>().min(0).optional(),
  usageLimit: z.coerce.number<number>().min(1).optional(),
  startDate: z.string().min(1, 'Vui lòng chọn ngày bắt đầu'),
  endDate: z.string().min(1, 'Vui lòng chọn ngày kết thúc'),
  isActive: z.boolean(),
})

export type CouponFormValues = z.infer<typeof couponSchema>
