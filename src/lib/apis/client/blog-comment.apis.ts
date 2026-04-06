import { kyNextInstance } from '@/lib/kyInstance/kyNext'
import { extractErrorMessage } from '@/lib/utils/error-handler'
import type {
  IApiPaginationResponseWrapperType,
  IApiResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces'
import type {
  IBlogCommentDataType,
  IBlogCommentFilters,
  ICreateBlogCommentPayload,
  IUpdateBlogCommentPayload,
  IBlogCommentReportDataType,
  IBlogCommentReportFilters,
  ICreateBlogCommentReportPayload,
  IUpdateBlogCommentReportStatusPayload,
} from '@/lib/types/interfaces/apis/blog-comment.interfaces'

// Helper: loại bỏ undefined trước khi truyền vào searchParams
const buildSearchParams = (
  options: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean> =>
  Object.fromEntries(
    Object.entries(options).filter(([, v]) => v !== undefined),
  ) as Record<string, string | number | boolean>

// ────────────────────────────────────────────────────────────────────────────────
// PUBLIC BLOG COMMENT APIs
// ────────────────────────────────────────────────────────────────────────────────

export const getBlogCommentsClientAPI = async (
  params: IBlogCommentFilters = {},
) => {
  try {
    return await kyNextInstance
      .get('blog-comment', {
        searchParams: buildSearchParams({
          page: params.page,
          limit: params.limit,
          postId: params.postId,
          userId: params.userId,
          parentId: params.parentId,
        }),
      })
      .json<IApiPaginationResponseWrapperType<IBlogCommentDataType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to fetch comments'),
    )
  }
}

export const getBlogCommentByIdClientAPI = async (id: string) => {
  try {
    return await kyNextInstance
      .get(`blog-comment/${id}`)
      .json<IApiResponseWrapperType<IBlogCommentDataType>>()
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Failed to fetch comment'))
  }
}

// ────────────────────────────────────────────────────────────────────────────────
// PROTECTED BLOG COMMENT APIs
// ────────────────────────────────────────────────────────────────────────────────

export const createBlogCommentClientAPI = async (
  data: ICreateBlogCommentPayload,
) => {
  try {
    return await kyNextInstance
      .post('blog-comment', { json: data })
      .json<IApiResponseWrapperType<IBlogCommentDataType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to create comment'),
    )
  }
}

export const updateBlogCommentClientAPI = async (
  id: string,
  data: IUpdateBlogCommentPayload,
) => {
  try {
    return await kyNextInstance
      .patch(`blog-comment/${id}`, { json: data })
      .json<IApiResponseWrapperType<IBlogCommentDataType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to update comment'),
    )
  }
}

export const deleteBlogCommentClientAPI = async (id: string) => {
  try {
    return await kyNextInstance
      .delete(`blog-comment/${id}`)
      .json<IApiResponseWrapperType<{ message: string }>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to delete comment'),
    )
  }
}

// ────────────────────────────────────────────────────────────────────────────────
// BLOG COMMENT REPORT APIs
// ────────────────────────────────────────────────────────────────────────────────

export const createBlogCommentReportClientAPI = async (
  data: ICreateBlogCommentReportPayload,
) => {
  try {
    return await kyNextInstance
      .post('blog-comment-report', { json: data })
      .json<IApiResponseWrapperType<IBlogCommentReportDataType>>()
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Failed to create report'))
  }
}

// ────────────────────────────────────────────────────────────────────────────────
// ADMIN BLOG COMMENT APIs
// ────────────────────────────────────────────────────────────────────────────────

export const getAllAdminBlogCommentsClientAPI = async (
  params: IBlogCommentFilters = {},
) => {
  try {
    return await kyNextInstance
      .get('admin/blog-comment', {
        searchParams: buildSearchParams({
          page: params.page,
          limit: params.limit,
          postId: params.postId,
          userId: params.userId,
        }),
      })
      .json<IApiPaginationResponseWrapperType<IBlogCommentDataType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to fetch admin comments'),
    )
  }
}

export const adminUpdateBlogCommentClientAPI = async (
  id: string,
  data: IUpdateBlogCommentPayload,
) => {
  try {
    return await kyNextInstance
      .patch(`admin/blog-comment/${id}`, { json: data })
      .json<IApiResponseWrapperType<IBlogCommentDataType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to update comment'),
    )
  }
}

export const adminDeleteBlogCommentClientAPI = async (id: string) => {
  try {
    return await kyNextInstance
      .delete(`admin/blog-comment/${id}`)
      .json<IApiResponseWrapperType<{ message: string }>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to delete comment'),
    )
  }
}

// ────────────────────────────────────────────────────────────────────────────────
// ADMIN BLOG COMMENT REPORT APIs
// ────────────────────────────────────────────────────────────────────────────────

export const getAllBlogCommentReportsClientAPI = async (
  params: IBlogCommentReportFilters = {},
) => {
  try {
    return await kyNextInstance
      .get('admin/blog-comment-report', {
        searchParams: buildSearchParams({
          page: params.page,
          limit: params.limit,
          status: params.status,
          reason: params.reason,
          commentId: params.commentId,
        }),
      })
      .json<IApiPaginationResponseWrapperType<IBlogCommentReportDataType>>()
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Failed to fetch reports'))
  }
}

export const getBlogCommentReportByIdClientAPI = async (id: string) => {
  try {
    return await kyNextInstance
      .get(`admin/blog-comment-report/${id}`)
      .json<IApiResponseWrapperType<IBlogCommentReportDataType>>()
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Failed to fetch report'))
  }
}

export const updateBlogCommentReportStatusClientAPI = async (
  id: string,
  data: IUpdateBlogCommentReportStatusPayload,
) => {
  try {
    return await kyNextInstance
      .patch(`admin/blog-comment-report/${id}/status`, { json: data })
      .json<IApiResponseWrapperType<IBlogCommentReportDataType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to update report status'),
    )
  }
}
