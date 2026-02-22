import { requiredString } from '@/lib/zod-schemas/schema';
import z from 'zod';

export const updateUserInfomationSchema = z.object({
  firstName: requiredString('Tên'),
  lastName: requiredString('Họ'),
  phone: requiredString('Số điện thoại'),
  bio: z.optional(z.string()),
  website: z.optional(z.string()),
});

export type UpdateUserInfomationValues = z.infer<
  typeof updateUserInfomationSchema
>;
