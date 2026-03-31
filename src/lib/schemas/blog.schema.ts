import { z } from 'zod'
import { BlogPostStatus } from '@/lib/types/interfaces/apis/blog.interfaces'

const requiredString = (fieldName: string) =>
  z.string().trim().min(1, `${fieldName} không được để trống`)

// Blog Topic Schemas
export const blogTopicSchema = z.object({
  name: requiredString('Tên chủ đề'),
  description: z.string().optional(),
  parentId: z.string().uuid().optional(),
  sortOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
  image: z.union([z.string(), z.instanceof(File)]).optional(),
})

export type BlogTopicFormValues = z.infer<typeof blogTopicSchema>

// Blog Post Schemas
export const blogPostSchema = z.object({
  title: requiredString('Tiêu đề'),
  content: requiredString('Nội dung'),
  excerpt: z.string().optional(),
  topicId: z.string().uuid().optional(),
  status: z.nativeEnum(BlogPostStatus).optional(),
  tags: z.array(z.string()).optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  featuredImage: z.union([z.string(), z.instanceof(File)]).optional(),
})

export type BlogPostFormValues = z.infer<typeof blogPostSchema>
