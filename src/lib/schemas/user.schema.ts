import { z } from 'zod'
import { requiredString } from '@/lib/schemas/shared.schema'

/**
 * User Schemas
 * Validation schemas for user profile and account forms
 */

export const updateUserInfoSchema = z.object({
  firstName: requiredString('Tên'),
  lastName: requiredString('Họ'),
  phone: requiredString('Số điện thoại'),
  bio: z.string().optional(),
  website: z.string().optional(),
})

export const accountFormSchema = z.object({
  firstName: z.string().min(1, 'Vui lòng nhập tên'),
  lastName: z.string().min(1, 'Vui lòng nhập họ'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().min(1, 'Vui lòng nhập số điện thoại'),
})

export type UpdateUserInfoValues = z.infer<typeof updateUserInfoSchema>
export type AccountFormValues = z.infer<typeof accountFormSchema>
