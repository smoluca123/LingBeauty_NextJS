import z from 'zod';

// Form validation schema - matches IAddressDataType from API
export const addressFormSchema = z.object({
  fullName: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  phone: z
    .string()
    .min(10, 'Số điện thoại phải có ít nhất 10 số')
    .regex(/^[0-9]+$/, 'Số điện thoại chỉ được chứa số'),
  addressLine1: z.string().min(5, 'Địa chỉ phải có ít nhất 5 ký tự'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'Vui lòng chọn Quận/Huyện'),
  province: z.string().min(1, 'Vui lòng chọn Tỉnh/Thành phố'),
  postalCode: z.string().min(1, 'Vui lòng chọn Phường/Xã'),
  type: z.enum(['HOME', 'OFFICE', 'OTHER']),
  isDefault: z.boolean().optional().default(false),
});

export type AddressFormValues = z.infer<typeof addressFormSchema>;

export const updateAddressSchema = z.object({
  fullName: z.string().min(2, 'Tên phải có ít nhất 2 ký tự').optional(),
  phone: z
    .string()
    .min(10, 'Số điện thoại phải có ít nhất 10 số')
    .regex(/^[0-9]+$/, 'Số điện thoại chỉ được chứa số')
    .optional(),
  addressLine1: z.string().min(5, 'Địa chỉ phải có ít nhất 5 ký tự').optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  postalCode: z.string().optional(),
  type: z.enum(['HOME', 'OFFICE', 'OTHER']).optional(),
  isDefault: z.boolean().optional().default(false),
});

export type UpdateAddressValues = z.infer<typeof updateAddressSchema>;
