import { z } from 'zod';

// ─── Schema ───────────────────────────────────────────────────────────────────

export const productVariantSchema = z.object({
  name: z
    .string()
    .min(1, 'Tên biến thể là bắt buộc')
    .max(100, 'Tên tối đa 100 ký tự'),

  sku: z.string().max(50, 'SKU tối đa 50 ký tự').optional(),

  // Appearance
  color: z.string().max(50, 'Màu sắc tối đa 50 ký tự').optional(),
  size:  z.string().max(20, 'Kích thước tối đa 20 ký tự').optional(),
  type:  z.string().max(50, 'Loại tối đa 50 ký tự').optional(),

  // Pricing (stored as string from input, parsed on submit)
  price:             z.number().min(0, 'Giá phải ≥ 0').optional(),
  quantity:          z.number().int().min(0, 'Số lượng phải ≥ 0').optional(),
  lowStockThreshold: z.number().int().min(0, 'Ngưỡng phải ≥ 0').optional(),
  sortOrder:         z.number().int().min(0).optional(),
});

export type ProductVariantFormValues = z.infer<typeof productVariantSchema>;

export const productVariantDefaultValues: ProductVariantFormValues = {
  name: '',
  sku: '',
  color: '',
  size: '',
  type: '',
  price: undefined,
  quantity: 0,
  lowStockThreshold: 10,
  sortOrder: 0,
};
