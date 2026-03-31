'use server'
import { DEFAULT_CACHE_TIME } from '@/constants/cache'
import { kyInstance } from '@/lib/kyInstance/ky'
import { publicKyInstance } from '@/lib/kyInstance/publicKy'
import type {
  IApiPaginationResponseWrapperType,
  IApiResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces'
import type {
  IBlogTopicDataType,
  IBlogPostDataType,
  IBlogTopicFilters,
  IBlogPostFilters,
  ICreateBlogTopicPayload,
  IUpdateBlogTopicPayload,
  ICreateBlogPostPayload,
  IUpdateBlogPostPayload,
} from '@/lib/types/interfaces/apis/blog.interfaces'
import { cacheLife, cacheTag } from 'next/cache'

// Helper: build search params object, omitting undefined values
const buildSearchParams = (
  options: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean> =>
  Object.fromEntries(
    Object.entries(options).filter(([, v]) => v !== undefined),
  ) as Record<string, string | number | boolean>

// ────────────────────────────────────────────────────────────────────────────────
// PUBLIC BLOG TOPIC APIs
// ────────────────────────────────────────────────────────────────────────────────

/**
 * Get all public blog topics (active only)
 */
export const getPublicBlogTopicsAPI = async (
  params: IBlogTopicFilters = {},
) => {
  'use cache'
  cacheLife(DEFAULT_CACHE_TIME)
  cacheTag('blog-topics')

  return publicKyInstance
    .get('public/blog-topic', {
      searchParams: buildSearchParams({
        page: params.page,
        limit: params.limit,
        search: params.search,
        isActive: params.isActive,
      }),
    })
    .json<IApiPaginationResponseWrapperType<IBlogTopicDataType>>()
}

/**
 * Get public blog topic by slug
 */
export const getPublicBlogTopicBySlugAPI = async (slug: string) => {
  'use cache'
  cacheLife(DEFAULT_CACHE_TIME)
  cacheTag('blog-topics', `blog-topic-${slug}`)

  return publicKyInstance
    .get(`public/blog-topic/slug/${slug}`)
    .json<IApiResponseWrapperType<IBlogTopicDataType>>()
}

// ────────────────────────────────────────────────────────────────────────────────
// PUBLIC BLOG POST APIs
// ────────────────────────────────────────────────────────────────────────────────

/**
 * Get all public blog posts (published only)
 */
export const getPublicBlogPostsAPI = async (params: IBlogPostFilters = {}) => {
  'use cache'
  cacheLife(DEFAULT_CACHE_TIME)
  cacheTag('blog-posts')

  return publicKyInstance
    .get('public/blog-post', {
      searchParams: buildSearchParams({
        page: params.page,
        limit: params.limit,
        search: params.search,
        topicId: params.topicId,
        tag: params.tag,
        sortBy: params.sortBy,
        order: params.order,
      }),
    })
    .json<IApiPaginationResponseWrapperType<IBlogPostDataType>>()
}

/**
 * Get public blog post by slug (increments view count)
 */
export const getPublicBlogPostBySlugAPI = async (slug: string) => {
  'use cache'
  cacheLife(DEFAULT_CACHE_TIME)
  cacheTag('blog-posts', `blog-post-${slug}`)

  return publicKyInstance
    .get(`public/blog-post/slug/${slug}`)
    .json<IApiResponseWrapperType<IBlogPostDataType>>()
}

// ────────────────────────────────────────────────────────────────────────────────
// ADMIN BLOG TOPIC APIs
// ────────────────────────────────────────────────────────────────────────────────

/**
 * Get all blog topics (admin - includes inactive)
 */
export const getAllBlogTopicsAPI = async (params: IBlogTopicFilters = {}) => {
  return kyInstance
    .get('blog-topic', {
      searchParams: buildSearchParams({
        page: params.page,
        limit: params.limit,
        search: params.search,
        isActive: params.isActive,
      }),
    })
    .json<IApiPaginationResponseWrapperType<IBlogTopicDataType>>()
}

/**
 * Get blog topic by ID (admin)
 */
export const getBlogTopicByIdAPI = async (id: string) => {
  return kyInstance
    .get(`blog-topic/${id}`)
    .json<IApiResponseWrapperType<IBlogTopicDataType>>()
}

/**
 * Create blog topic (admin)
 */
export const createBlogTopicAPI = async (data: ICreateBlogTopicPayload) => {
  return kyInstance
    .post('blog-topic', { json: data })
    .json<IApiResponseWrapperType<IBlogTopicDataType>>()
}

/**
 * Create sub-topic under parent (admin)
 */
export const createSubTopicAPI = async (
  parentId: string,
  data: ICreateBlogTopicPayload,
) => {
  return kyInstance
    .post(`blog-topic/${parentId}/sub-topic`, { json: data })
    .json<IApiResponseWrapperType<IBlogTopicDataType>>()
}

/**
 * Update blog topic (admin)
 */
export const updateBlogTopicAPI = async (
  id: string,
  data: IUpdateBlogTopicPayload,
) => {
  return kyInstance
    .patch(`blog-topic/${id}`, { json: data })
    .json<IApiResponseWrapperType<IBlogTopicDataType>>()
}

/**
 * Delete blog topic (admin)
 */
export const deleteBlogTopicAPI = async (id: string) => {
  return kyInstance
    .delete(`blog-topic/${id}`)
    .json<IApiResponseWrapperType<IBlogTopicDataType>>()
}

/**
 * Upload topic image (admin)
 */
export const uploadTopicImageAPI = async (id: string, formData: FormData) => {
  return kyInstance
    .post(`blog-topic/${id}/upload/image`, { body: formData })
    .json<IApiResponseWrapperType<IBlogTopicDataType>>()
}

// ────────────────────────────────────────────────────────────────────────────────
// ADMIN BLOG POST APIs
// ────────────────────────────────────────────────────────────────────────────────

/**
 * Get all blog posts (admin - includes drafts)
 */
export const getAllBlogPostsAPI = async (params: IBlogPostFilters = {}) => {
  return kyInstance
    .get('blog-post', {
      searchParams: buildSearchParams({
        page: params.page,
        limit: params.limit,
        search: params.search,
        topicId: params.topicId,
        authorId: params.authorId,
        status: params.status,
        tag: params.tag,
        sortBy: params.sortBy,
        order: params.order,
      }),
    })
    .json<IApiPaginationResponseWrapperType<IBlogPostDataType>>()
}

/**
 * Get blog post by ID (admin)
 */
export const getBlogPostByIdAPI = async (id: string) => {
  return kyInstance
    .get(`blog-post/${id}`)
    .json<IApiResponseWrapperType<IBlogPostDataType>>()
}

/**
 * Create blog post (admin)
 */
export const createBlogPostAPI = async (data: ICreateBlogPostPayload) => {
  return kyInstance
    .post('blog-post', { json: data })
    .json<IApiResponseWrapperType<IBlogPostDataType>>()
}

/**
 * Update blog post (admin)
 */
export const updateBlogPostAPI = async (
  id: string,
  data: IUpdateBlogPostPayload,
) => {
  return kyInstance
    .patch(`blog-post/${id}`, { json: data })
    .json<IApiResponseWrapperType<IBlogPostDataType>>()
}

/**
 * Delete blog post (admin)
 */
export const deleteBlogPostAPI = async (id: string) => {
  return kyInstance
    .delete(`blog-post/${id}`)
    .json<IApiResponseWrapperType<IBlogPostDataType>>()
}

/**
 * Upload featured image for post (admin)
 */
export const uploadPostFeaturedImageAPI = async (
  id: string,
  formData: FormData,
) => {
  return kyInstance
    .post(`blog-post/${id}/upload/featured-image`, { body: formData })
    .json<IApiResponseWrapperType<IBlogPostDataType>>()
}
