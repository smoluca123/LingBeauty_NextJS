import { kyNextInstance } from '@/lib/kyInstance/kyNext'
import { extractErrorMessage } from '@/lib/utils/error-handler'
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

export const getAllBlogPostsClientAPI = async (
  filters: IBlogPostFilters = {},
) => {
  try {
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

    return await kyNextInstance
      .get('admin/blog-post', { searchParams })
      .json<IApiPaginationResponseWrapperType<IBlogPostDataType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Không thể tải danh sách bài viết'),
    )
  }
}

export const getBlogPostByIdClientAPI = async (id: string) => {
  try {
    return await kyNextInstance
      .get(`admin/blog-post/${id}`)
      .json<IApiResponseWrapperType<IBlogPostDataType>>()
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Không thể tải bài viết'))
  }
}

export const createBlogPostClientAPI = async (
  data: Omit<ICreateBlogPostPayload, 'featuredImage'>,
) => {
  try {
    return await kyNextInstance
      .post('admin/blog-post', { json: data })
      .json<IApiResponseWrapperType<IBlogPostDataType>>()
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Không thể tạo bài viết'))
  }
}

export const updateBlogPostClientAPI = async (
  id: string,
  data: Omit<IUpdateBlogPostPayload, 'featuredImage'>,
) => {
  try {
    return await kyNextInstance
      .patch(`admin/blog-post/${id}`, { json: data })
      .json<IApiResponseWrapperType<IBlogPostDataType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Không thể cập nhật bài viết'),
    )
  }
}

export const uploadBlogPostFeaturedImageClientAPI = async (
  postId: string,
  file: File,
) => {
  try {
    const formData = new FormData()
    formData.append('file', file) // Backend expects 'file' field name

    return await kyNextInstance
      .post(`admin/blog-post/${postId}/upload/featured-image`, {
        body: formData,
      })
      .json<IApiResponseWrapperType<IBlogPostDataType>>()
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Không thể tải ảnh lên'))
  }
}

export const deleteBlogPostClientAPI = async (id: string) => {
  try {
    return await kyNextInstance
      .delete(`admin/blog-post/${id}`)
      .json<IApiResponseWrapperType<IBlogPostDataType>>()
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Không thể xóa bài viết'))
  }
}

// ============ Blog Topics ============

export const getAllBlogTopicsClientAPI = async (
  filters: IBlogTopicFilters = {},
) => {
  try {
    const searchParams = new URLSearchParams()

    if (filters.page) searchParams.set('page', filters.page.toString())
    if (filters.limit) searchParams.set('limit', filters.limit.toString())
    if (filters.search) searchParams.set('search', filters.search)
    if (filters.isActive !== undefined)
      searchParams.set('isActive', filters.isActive.toString())

    return await kyNextInstance
      .get('admin/blog-topic', { searchParams })
      .json<IApiPaginationResponseWrapperType<IBlogTopicDataType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Không thể tải danh sách chủ đề'),
    )
  }
}

export const getBlogTopicByIdClientAPI = async (id: string) => {
  try {
    return await kyNextInstance
      .get(`admin/blog-topic/${id}`)
      .json<IApiResponseWrapperType<IBlogTopicDataType>>()
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Không thể tải chủ đề'))
  }
}

export const createBlogTopicClientAPI = async (
  data: Omit<ICreateBlogTopicPayload, 'image'>,
) => {
  try {
    // Nếu có parentId, gọi API tạo sub-topic
    // Nếu không có parentId, gọi API tạo topic chính
    const endpoint = data.parentId
      ? `admin/blog-topic/${data.parentId}/sub-topic`
      : 'admin/blog-topic'

    return await kyNextInstance
      .post(endpoint, { json: data })
      .json<IApiResponseWrapperType<IBlogTopicDataType>>()
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Không thể tạo chủ đề'))
  }
}

export const uploadBlogTopicImageClientAPI = async (
  topicId: string,
  file: File,
) => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    return await kyNextInstance
      .post(`admin/blog-topic/${topicId}/upload/image`, { body: formData })
      .json<IApiResponseWrapperType<IBlogTopicDataType>>()
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Không thể tải ảnh lên'))
  }
}

export const updateBlogTopicClientAPI = async (
  id: string,
  data: Omit<IUpdateBlogTopicPayload, 'image'>,
) => {
  try {
    return await kyNextInstance
      .patch(`admin/blog-topic/${id}`, { json: data })
      .json<IApiResponseWrapperType<IBlogTopicDataType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Không thể cập nhật chủ đề'),
    )
  }
}

export const deleteBlogTopicClientAPI = async (id: string) => {
  try {
    return await kyNextInstance
      .delete(`admin/blog-topic/${id}`)
      .json<IApiResponseWrapperType<IBlogTopicDataType>>()
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Không thể xóa chủ đề'))
  }
}
