import { z } from 'zod'
import { BlogPostStatus } from '@/lib/types/interfaces/apis/blog.interfaces'

const requiredString = (fieldName: string) =>
  z.string().trim().min(1, `${fieldName} là bắt buộc`)

/**
 * Schema cho tạo/cập nhật blog post
 */
export const blogPostSchema = z.object({
  title: requiredString('Tiêu đề'),
  content: requiredString('Nội dung'),
  excerpt: z.string().optional(),
  topicId: z.uuid('ID chủ đề không hợp lệ').optional(),
  status: z.enum(BlogPostStatus).default(BlogPostStatus.DRAFT),
  tags: z.array(z.string()).default([]),
  metaTitle: z.string().max(60, 'Meta title tối đa 60 ký tự').optional(),
  metaDescription: z
    .string()
    .max(160, 'Meta description tối đa 160 ký tự')
    .optional(),
  featuredImage: z.instanceof(File).optional(),
})

export type BlogPostFormValues = z.infer<typeof blogPostSchema>

/**
 * Schema cho tạo/cập nhật blog topic
 */
export const blogTopicSchema = z.object({
  name: requiredString('Tên chủ đề'),
  description: z.string().optional(),
  parentId: z.uuid('ID chủ đề cha không hợp lệ').optional(),
  sortOrder: z.coerce.number<number>().int().min(0).default(0),
  isActive: z.boolean().default(true),
  image: z.instanceof(File).optional(),
})

export type BlogTopicFormValues = z.infer<typeof blogTopicSchema>
