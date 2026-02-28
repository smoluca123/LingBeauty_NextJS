import { z } from 'zod';

// ============ Product Form Schema ============
export const productFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Tên sản phẩm là bắt buộc')
    .max(200, 'Tên sản phẩm tối đa 200 ký tự'),
  slug: z
    .string()
    .max(200, 'Slug tối đa 200 ký tự')
    .optional(),
  sku: z
    .string()
    .max(50, 'SKU tối đa 50 ký tự')
    .optional(),
  shortDesc: z
    .string()
    .max(500, 'Mô tả ngắn tối đa 500 ký tự')
    .optional(),
  categoryId: z
    .string()
    .min(1, 'Vui lòng chọn danh mục'),
  brandId: z
    .string()
    .min(1, 'Vui lòng chọn thương hiệu'),
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
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

// Default values for form
export const productFormDefaultValues: ProductFormValues = {
  name: '',
  slug: '',
  sku: '',
  shortDesc: '',
  categoryId: '',
  brandId: '',
  basePrice: 0,
  comparePrice: 0,
  stock: 0,
  lowStockThreshold: 10,
  isActive: true,
  isFeatured: false,
};
