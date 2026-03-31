// Blog Topic Interfaces
export interface IBlogTopicDataType {
  id: string
  name: string
  slug: string
  description?: string
  parentId?: string
  sortOrder: number
  isActive: boolean
  imageMedia?: {
    id: string
    url: string
    type: string
  }
  children?: IBlogTopicDataType[]
  postCount?: number
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}

export interface ICreateBlogTopicPayload {
  name: string
  description?: string
  sortOrder?: number
  isActive?: boolean
}

export interface IUpdateBlogTopicPayload {
  name?: string
  description?: string
  sortOrder?: number
  isActive?: boolean
}

export interface IBlogTopicFilters {
  page?: number
  limit?: number
  search?: string
  isActive?: boolean
}

// Blog Post Interfaces
export enum BlogPostStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
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
  topic?: IBlogTopicDataType
  author?: {
    id: string
    username: string
    email: string
    fullName?: string
  }
  featuredImage?: {
    id: string
    url: string
    type: string
  }
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}

export interface ICreateBlogPostPayload {
  title: string
  content: string
  excerpt?: string
  topicId?: string
  status?: BlogPostStatus
  tags?: string[]
  metaTitle?: string
  metaDescription?: string
}

export interface IUpdateBlogPostPayload {
  title?: string
  content?: string
  excerpt?: string
  topicId?: string
  status?: BlogPostStatus
  tags?: string[]
  metaTitle?: string
  metaDescription?: string
}

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
