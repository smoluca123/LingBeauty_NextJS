'use server'

import { kyInstance } from '@/lib/kyInstance/ky'
import type {
  IBlogPostDataType,
  IBlogTopicDataType,
  IBlogPostFilters,
  IBlogTopicFilters,
  ICreateBlogPostPayload,
  IUpdateBlogPostPayload,
  ICreateBlogTopicPayload,
  IUpdateBlogTopicPayload,
} from '@/lib/types/interfaces/apis/blog.interfaces'
import type {
  IApiResponseWrapperType,
  IApiPaginationResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces'

// ============ Blog Posts ============

export const getAllBlogPostsAPI = async (filters: IBlogPostFilters = {}) => {
  const searchParams = new URLSearchParams()

  if (filters.page) searchParams.set('page', filters.page.toString())
  if (filters.limit) searchParams.set('limit', filters.limit.toString())
  if (filters.search) searchParams.set('search', filters.search)
  if (filters.topicId) searchParams.set('topicId', filters.topicId)
  if (filters.authorId) searchParams.set('authorId', filters.authorId)
  if (filters.status) searchParams.set('status', filters.status)
  if (filters.tag) searchParams.set('tag', filters.tag)
  if (filters.sortBy) searchParams.set('sortBy', filters.sortBy)
  if (filters.order) searchParams.set('order', filters.order)

  return kyInstance
    .get('blog-post', { searchParams })
    .json<IApiPaginationResponseWrapperType<IBlogPostDataType>>()
}

export const getBlogPostByIdAPI = async (id: string) => {
  return kyInstance
    .get(`blog-post/${id}`)
    .json<IApiResponseWrapperType<IBlogPostDataType>>()
}

export const createBlogPostAPI = async (
  data: Omit<ICreateBlogPostPayload, 'featuredImage'>,
) => {
  return kyInstance
    .post('blog-post', { json: data })
    .json<IApiResponseWrapperType<IBlogPostDataType>>()
}

export const updateBlogPostAPI = async (
  id: string,
  data: Omit<IUpdateBlogPostPayload, 'featuredImage'>,
) => {
  return kyInstance
    .patch(`blog-post/${id}`, { json: data })
    .json<IApiResponseWrapperType<IBlogPostDataType>>()
}

export const uploadBlogPostFeaturedImageAPI = async (
  postId: string,
  file: File,
) => {
  const formData = new FormData()
  formData.append('file', file) // Backend expects 'file' field name

  return kyInstance
    .post(`blog-post/${postId}/upload/featured-image`, { body: formData })
    .json<IApiResponseWrapperType<IBlogPostDataType>>()
}

export const deleteBlogPostAPI = async (id: string) => {
  return kyInstance
    .delete(`blog-post/${id}`)
    .json<IApiResponseWrapperType<IBlogPostDataType>>()
}

// ============ Blog Topics ============

export const getAllBlogTopicsAPI = async (filters: IBlogTopicFilters = {}) => {
  const searchParams = new URLSearchParams()

  if (filters.page) searchParams.set('page', filters.page.toString())
  if (filters.limit) searchParams.set('limit', filters.limit.toString())
  if (filters.search) searchParams.set('search', filters.search)
  if (filters.isActive !== undefined)
    searchParams.set('isActive', filters.isActive.toString())

  return kyInstance
    .get('blog-topic', { searchParams })
    .json<IApiPaginationResponseWrapperType<IBlogTopicDataType>>()
}

export const getBlogTopicByIdAPI = async (id: string) => {
  return kyInstance
    .get(`blog-topic/${id}`)
    .json<IApiResponseWrapperType<IBlogTopicDataType>>()
}

export const createBlogTopicAPI = async (data: ICreateBlogTopicPayload) => {
  const formData = new FormData()

  formData.append('name', data.name)
  if (data.description) formData.append('description', data.description)
  if (data.parentId) formData.append('parentId', data.parentId)
  if (data.sortOrder !== undefined)
    formData.append('sortOrder', data.sortOrder.toString())
  if (data.isActive !== undefined)
    formData.append('isActive', data.isActive.toString())
  if (data.image) formData.append('image', data.image)

  return kyInstance
    .post('blog-topic', { body: formData })
    .json<IApiResponseWrapperType<IBlogTopicDataType>>()
}

export const updateBlogTopicAPI = async (
  id: string,
  data: IUpdateBlogTopicPayload,
) => {
  const formData = new FormData()

  if (data.name) formData.append('name', data.name)
  if (data.description !== undefined)
    formData.append('description', data.description)
  if (data.parentId !== undefined) formData.append('parentId', data.parentId)
  if (data.sortOrder !== undefined)
    formData.append('sortOrder', data.sortOrder.toString())
  if (data.isActive !== undefined)
    formData.append('isActive', data.isActive.toString())
  if (data.image) formData.append('image', data.image)

  return kyInstance
    .patch(`blog-topic/${id}`, { body: formData })
    .json<IApiResponseWrapperType<IBlogTopicDataType>>()
}

export const deleteBlogTopicAPI = async (id: string) => {
  return kyInstance
    .delete(`blog-topic/${id}`)
    .json<IApiResponseWrapperType<IBlogTopicDataType>>()
}
