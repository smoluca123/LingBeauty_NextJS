import { requiredString } from '@/lib/zod-schemas/schema';
import { z } from 'zod';

// Password validation schema
export const passwordSchema = z
  .string()
  .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
  .max(50, 'Mật khẩu không được vượt quá 50 ký tự')
  .regex(/[A-Z]/, 'Mật khẩu phải chứa ít nhất 1 chữ hoa')
  .regex(/[a-z]/, 'Mật khẩu phải chứa ít nhất 1 chữ thường')
  .regex(/[0-9]/, 'Mật khẩu phải chứa ít nhất 1 số')
  .regex(/[@$!%*?&]/, 'Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt');

export const loginSchema = z.object({
  usernameOrEmail: requiredString('Username hoặc Email'),
  password: requiredString('Mật khẩu'),
});

export const registerSchema = z
  .object({
    firstName: requiredString('Tên'),
    lastName: requiredString('Họ'),
    username: requiredString('Username'),
    email: z.email('Địa chỉ email không hợp lệ'),
    password: passwordSchema,
    confirmPassword: requiredString('Xác nhận mật khẩu'),
    phone: z.optional(z.string().min(10, 'Số điện thoại không hợp lệ')),
    // age: z.optional(z.number().min(10, 'Must be at least 10 years old')),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

export const commentSchema = z.object({
  content: requiredString('Nội dung'),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại'),
    newPassword: z
      .string()
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
      .max(50, 'Mật khẩu không được vượt quá 50 ký tự')
      .regex(/[A-Z]/, 'Mật khẩu phải chứa ít nhất 1 chữ hoa')
      .regex(/[a-z]/, 'Mật khẩu phải chứa ít nhất 1 chữ thường')
      .regex(/[0-9]/, 'Mật khẩu phải chứa ít nhất 1 số')
      .regex(/[@$!%*?&]/, 'Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu mới'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type CommentValues = z.infer<typeof commentSchema>;
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
