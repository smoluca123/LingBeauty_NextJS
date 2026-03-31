import { kyNextInstance } from '@/lib/kyInstance/kyNext'
import { extractErrorMessage } from '@/lib/utils/error-handler'
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

// Helper: loại bỏ undefined trước khi truyền vào searchParams
const buildSearchParams = (
  options: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean> =>
  Object.fromEntries(
    Object.entries(options).filter(([, v]) => v !== undefined),
  ) as Record<string, string | number | boolean>

// ────────────────────────────────────────────────────────────────────────────────
// PUBLIC BLOG TOPIC APIs
// ────────────────────────────────────────────────────────────────────────────────

export const getPublicBlogTopicsClientAPI = async (
  params: IBlogTopicFilters = {},
) => {
  try {
    return await kyNextInstance
      .get('public/blog-topic', {
        searchParams: buildSearchParams({
          page: params.page,
          limit: params.limit,
          search: params.search,
          isActive: params.isActive,
        }),
      })
      .json<IApiPaginationResponseWrapperType<IBlogTopicDataType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to fetch blog topics'),
    )
  }
}

export const getPublicBlogTopicBySlugClientAPI = async (slug: string) => {
  try {
    return await kyNextInstance
      .get(`public/blog-topic/slug/${slug}`)
      .json<IApiResponseWrapperType<IBlogTopicDataType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to fetch blog topic'),
    )
  }
}

// ────────────────────────────────────────────────────────────────────────────────
// PUBLIC BLOG POST APIs
// ────────────────────────────────────────────────────────────────────────────────

export const getPublicBlogPostsClientAPI = async (
  params: IBlogPostFilters = {},
) => {
  try {
    return await kyNextInstance
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
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to fetch blog posts'),
    )
  }
}

export const getPublicBlogPostBySlugClientAPI = async (slug: string) => {
  try {
    return await kyNextInstance
      .get(`public/blog-post/slug/${slug}`)
      .json<IApiResponseWrapperType<IBlogPostDataType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to fetch blog post'),
    )
  }
}

// ────────────────────────────────────────────────────────────────────────────────
// ADMIN BLOG TOPIC APIs
// ────────────────────────────────────────────────────────────────────────────────

export const getAllBlogTopicsClientAPI = async (
  params: IBlogTopicFilters = {},
) => {
  try {
    return await kyNextInstance
      .get('admin/blog-topic', {
        searchParams: buildSearchParams({
          page: params.page,
          limit: params.limit,
          search: params.search,
          isActive: params.isActive,
        }),
      })
      .json<IApiPaginationResponseWrapperType<IBlogTopicDataType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to fetch blog topics'),
    )
  }
}

export const createBlogTopicClientAPI = async (
  data: ICreateBlogTopicPayload,
) => {
  try {
    return await kyNextInstance
      .post('admin/blog-topic', { json: data })
      .json<IApiResponseWrapperType<IBlogTopicDataType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to create blog topic'),
    )
  }
}

export const updateBlogTopicClientAPI = async (
  id: string,
  data: IUpdateBlogTopicPayload,
) => {
  try {
    return await kyNextInstance
      .patch(`admin/blog-topic/${id}`, { json: data })
      .json<IApiResponseWrapperType<IBlogTopicDataType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to update blog topic'),
    )
  }
}

export const deleteBlogTopicClientAPI = async (id: string) => {
  try {
    return await kyNextInstance
      .delete(`admin/blog-topic/${id}`)
      .json<IApiResponseWrapperType<IBlogTopicDataType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to delete blog topic'),
    )
  }
}

export const getBlogTopicByIdClientAPI = async (id: string) => {
  try {
    return await kyNextInstance
      .get(`admin/blog-topic/${id}`)
      .json<IApiResponseWrapperType<IBlogTopicDataType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to fetch blog topic'),
    )
  }
}

export const createSubTopicClientAPI = async (
  parentId: string,
  data: ICreateBlogTopicPayload,
) => {
  try {
    return await kyNextInstance
      .post(`admin/blog-topic/${parentId}/sub-topic`, { json: data })
      .json<IApiResponseWrapperType<IBlogTopicDataType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to create sub-topic'),
    )
  }
}

export const uploadTopicImageClientAPI = async (
  id: string,
  formData: FormData,
) => {
  try {
    return await kyNextInstance
      .post(`admin/blog-topic/${id}/upload/image`, { body: formData })
      .json<IApiResponseWrapperType<IBlogTopicDataType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to upload topic image'),
    )
  }
}

// ────────────────────────────────────────────────────────────────────────────────
// ADMIN BLOG POST APIs
// ────────────────────────────────────────────────────────────────────────────────

export const getAllBlogPostsClientAPI = async (
  params: IBlogPostFilters = {},
) => {
  try {
    return await kyNextInstance
      .get('admin/blog-post', {
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
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to fetch blog posts'),
    )
  }
}

export const createBlogPostClientAPI = async (data: ICreateBlogPostPayload) => {
  try {
    return await kyNextInstance
      .post('admin/blog-post', { json: data })
      .json<IApiResponseWrapperType<IBlogPostDataType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to create blog post'),
    )
  }
}

export const updateBlogPostClientAPI = async (
  id: string,
  data: IUpdateBlogPostPayload,
) => {
  try {
    return await kyNextInstance
      .patch(`admin/blog-post/${id}`, { json: data })
      .json<IApiResponseWrapperType<IBlogPostDataType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to update blog post'),
    )
  }
}

export const deleteBlogPostClientAPI = async (id: string) => {
  try {
    return await kyNextInstance
      .delete(`admin/blog-post/${id}`)
      .json<IApiResponseWrapperType<IBlogPostDataType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to delete blog post'),
    )
  }
}

export const getBlogPostByIdClientAPI = async (id: string) => {
  try {
    return await kyNextInstance
      .get(`admin/blog-post/${id}`)
      .json<IApiResponseWrapperType<IBlogPostDataType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to fetch blog post'),
    )
  }
}

export const uploadPostFeaturedImageClientAPI = async (
  id: string,
  formData: FormData,
) => {
  try {
    return await kyNextInstance
      .post(`admin/blog-post/${id}/upload/featured-image`, { body: formData })
      .json<IApiResponseWrapperType<IBlogPostDataType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to upload featured image'),
    )
  }
}
