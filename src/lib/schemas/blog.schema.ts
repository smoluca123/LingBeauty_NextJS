import { z } from 'zod'
import { BlogPostStatus } from '@/lib/types/interfaces/apis/blog.interfaces'

// ── Helper Schemas ─────────────────────────────────────────────────────────────

const requiredString = (fieldName: string) =>
  z.string().trim().min(1, `${fieldName} không được để trống`)

// ── Blog Topic Schema (dùng chung cho create & update) ────────────────────────

export const blogTopicSchema = z.object({
  name: requiredString('Tên chủ đề'),
  description: z.string().optional(),
  parentId: z.string().uuid('Parent ID không hợp lệ').optional(),
  sortOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
  image: z.instanceof(File).optional(),
})

export type BlogTopicFormValues = z.infer<typeof blogTopicSchema>

// ── Blog Post Schema (dùng chung cho create & update) ─────────────────────────

export const blogPostSchema = z.object({
  title: requiredString('Tiêu đề'),
  content: requiredString('Nội dung'),
  excerpt: z.string().optional(),
  topicId: z.string().uuid('Topic ID không hợp lệ').optional(),
  status: z.nativeEnum(BlogPostStatus).optional(),
  tags: z.array(z.string()).optional(),
  metaTitle: z.string().max(60, 'Meta title tối đa 60 ký tự').optional(),
  metaDescription: z
    .string()
    .max(160, 'Meta description tối đa 160 ký tự')
    .optional(),
  featuredImage: z.instanceof(File).optional(),
})

export type BlogPostFormValues = z.infer<typeof blogPostSchema>
