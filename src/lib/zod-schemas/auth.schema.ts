import { requiredString } from '@/lib/zod-schemas/schema';
import { z } from 'zod';

// Password validation schema
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(
    /[0-9]|[^A-Za-z0-9]/,
    'Password must contain at least one number or symbol',
  );

export const loginSchema = z.object({
  usernameOrEmail: requiredString('Username or Email'),
  password: requiredString('Password'),
});

export const registerSchema = z
  .object({
    firstName: requiredString('First name'),
    lastName: requiredString('Last name'),
    username: requiredString('Username'),
    email: z.email('Invalid email address'),
    password: passwordSchema,
    confirmPassword: requiredString('Confirm password'),
    phone: z.optional(z.string().min(10, 'Invalid phone number')),
    // age: z.optional(z.number().min(10, 'Must be at least 10 years old')),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const commentSchema = z.object({
  content: requiredString('Content'),
});

export const changePasswordSchema = z
  .object({
    currentPassword: requiredString('Current password'),
    newPassword: passwordSchema,
    confirmPassword: requiredString('Confirm password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type CommentValues = z.infer<typeof commentSchema>;
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
