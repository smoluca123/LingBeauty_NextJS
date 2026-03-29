import * as z from 'zod'

export const categoryFormSchema = z
  .object({
    name: z.string().min(1, 'Tên danh mục là bắt buộc'),
    description: z.string(),
    isActive: z.boolean(),
    sortOrder: z.number().min(0, 'Thứ tự sắp xếp phải >= 0'),
    type: z.enum(['CATEGORY', 'BRAND']),
    brandId: z.string().optional(),
    parentId: z.string().optional(),
    imageFile: z.instanceof(File).nullable().optional(),
    imagePreview: z.string().nullable().optional(),
  })
  .refine(
    (data) => {
      // Nếu type là BRAND thì brandId phải có giá trị
      if (data.type === 'BRAND' && !data.brandId) {
        return false
      }
      return true
    },
    {
      message:
        'Vui lòng chọn thương hiệu liên kết khi loại danh mục là Thương hiệu',
      path: ['brandId'],
    },
  )

export type CategoryValues = z.infer<typeof categoryFormSchema>
