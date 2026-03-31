import { z } from 'zod'

export const bannerSchema = z.object({
  groupId: z.string().optional(),
  type: z.enum(['TEXT', 'IMAGE']),
  position: z.enum(['MAIN_CAROUSEL', 'SIDE_TOP', 'SIDE_BOTTOM']),
  badge: z.string().optional(),
  title: z.string().min(1, 'Vui lòng nhập tiêu đề'),
  description: z.string().optional(),
  highlight: z.string().optional(),
  ctaText: z.string().optional(),
  ctaLink: z.string().optional(),
  subLabel: z.string().optional(),
  gradientFrom: z.string().optional(),
  gradientTo: z.string().optional(),
  sortOrder: z.coerce.number<number>().min(0),
  isActive: z.boolean(),
})

export const bannerEditSchema = z.object({
  type: z.enum(['TEXT', 'IMAGE']),
  position: z.enum(['MAIN_CAROUSEL', 'SIDE_TOP', 'SIDE_BOTTOM']),
  badge: z.string().optional(),
  title: z.string().min(1, 'Vui lòng nhập tiêu đề'),
  description: z.string().optional(),
  highlight: z.string().optional(),
  ctaText: z.string().optional(),
  ctaLink: z.string().optional(),
  subLabel: z.string().optional(),
  gradientFrom: z.string().optional(),
  gradientTo: z.string().optional(),
  isActive: z.boolean(),
})

export type BannerFormValues = z.infer<typeof bannerSchema>
export type BannerEditFormValues = z.infer<typeof bannerEditSchema>
