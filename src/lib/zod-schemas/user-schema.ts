import { requiredString } from '@/lib/zod-schemas/schema';
import z from 'zod';

export const updateUserInfomationSchema = z.object({
  firstName: requiredString('First name'),
  lastName: requiredString('Last name'),
  phone: requiredString('Phone number'),
  bio: z.optional(z.string()),
  website: z.optional(z.string()),
});

export type UpdateUserInfomationValues = z.infer<typeof updateUserInfomationSchema>;
