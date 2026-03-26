import { z } from 'zod'

export const bannerGroupSchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập tên nhóm'),
  slug: z.string().min(1, 'Vui lòng nhập slug'),
  description: z.string().optional(),
  isActive: z.boolean(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

export type BannerGroupFormValues = z.infer<typeof bannerGroupSchema>
