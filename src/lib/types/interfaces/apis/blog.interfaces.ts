/**
 * Blog API Interfaces
 * Mapping từ backend DTOs
 */

export enum BlogPostStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export interface IMediaDataType {
  id: string
  url: string
  fileName: string
  fileSize: number
  mimeType: string
  width?: number
  height?: number
}

export interface IUserDataType {
  id: string
  email: string
  fullName: string
  avatar?: IMediaDataType
}

export interface IBlogTopicDataType {
  id: string
  name: string
  slug: string
  description?: string
  parentId?: string
  sortOrder: number
  isActive: boolean
  imageMedia?: IMediaDataType
  children?: IBlogTopicDataType[]
  postCount?: number
  createdAt: Date
  updatedAt: Date
}

export interface IBlogPostDataType {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  topicId?: string
  authorId: string
  status: BlogPostStatus
  tags: string[]
  viewCount: number
  metaTitle?: string
  metaDescription?: string
  publishedAt?: Date
  topic?: {
    id: string
    name: string
    slug: string
  }
  author?: IUserDataType
  featuredImage?: IMediaDataType
  createdAt: Date
  updatedAt: Date
}

// Create/Update Payloads
export interface ICreateBlogPostPayload {
  title: string
  content: string
  excerpt?: string
  topicId?: string
  status?: BlogPostStatus
  tags?: string[]
  metaTitle?: string
  metaDescription?: string
  featuredImage?: File
}

export interface IUpdateBlogPostPayload extends Partial<ICreateBlogPostPayload> {}

export interface ICreateBlogTopicPayload {
  name: string
  description?: string
  parentId?: string
  sortOrder?: number
  isActive?: boolean
  image?: File
}

export interface IUpdateBlogTopicPayload extends Partial<ICreateBlogTopicPayload> {}

// Query Filters
export interface IBlogPostFilters {
  page?: number
  limit?: number
  search?: string
  topicId?: string
  authorId?: string
  status?: BlogPostStatus
  tag?: string
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'viewCount'
  order?: 'asc' | 'desc'
}

export interface IBlogTopicFilters {
  page?: number
  limit?: number
  search?: string
  isActive?: boolean
}
