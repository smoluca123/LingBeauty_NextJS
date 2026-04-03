'use server'
import { kyInstance } from '@/lib/kyInstance/ky'
import { publicKyInstance } from '@/lib/kyInstance/publicKy'
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

// Helper: build search params object, omitting undefined values
const buildSearchParams = (
  options: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean> =>
  Object.fromEntries(
    Object.entries(options).filter(([, v]) => v !== undefined),
  ) as Record<string, string | number | boolean>

// ────────────────────────────────────────────────────────────────────────────────
// PUBLIC BLOG COMMENT APIs
// ────────────────────────────────────────────────────────────────────────────────

/**
 * Get all comments (public)
 */
export const getBlogCommentsAPI = async (params: IBlogCommentFilters = {}) => {
  return publicKyInstance
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
}

/**
 * Get comment by ID (public)
 */
export const getBlogCommentByIdAPI = async (id: string) => {
  return publicKyInstance
    .get(`blog-comment/${id}`)
    .json<IApiResponseWrapperType<IBlogCommentDataType>>()
}

// ────────────────────────────────────────────────────────────────────────────────
// PROTECTED BLOG COMMENT APIs
// ────────────────────────────────────────────────────────────────────────────────

/**
 * Create comment (protected)
 */
export const createBlogCommentAPI = async (data: ICreateBlogCommentPayload) => {
  return kyInstance
    .post('blog-comment', { json: data })
    .json<IApiResponseWrapperType<IBlogCommentDataType>>()
}

/**
 * Update comment (protected)
 */
export const updateBlogCommentAPI = async (
  id: string,
  data: IUpdateBlogCommentPayload,
) => {
  return kyInstance
    .patch(`blog-comment/${id}`, { json: data })
    .json<IApiResponseWrapperType<IBlogCommentDataType>>()
}

/**
 * Delete comment (protected)
 */
export const deleteBlogCommentAPI = async (id: string) => {
  return kyInstance
    .delete(`blog-comment/${id}`)
    .json<IApiResponseWrapperType<{ message: string }>>()
}

// ────────────────────────────────────────────────────────────────────────────────
// BLOG COMMENT REPORT APIs
// ────────────────────────────────────────────────────────────────────────────────

/**
 * Create comment report (protected)
 */
export const createBlogCommentReportAPI = async (
  data: ICreateBlogCommentReportPayload,
) => {
  return kyInstance
    .post('blog-comment-report', { json: data })
    .json<IApiResponseWrapperType<IBlogCommentReportDataType>>()
}

// ────────────────────────────────────────────────────────────────────────────────
// ADMIN BLOG COMMENT REPORT APIs
// ────────────────────────────────────────────────────────────────────────────────

/**
 * Get all reports (admin)
 */
export const getAllBlogCommentReportsAPI = async (
  params: IBlogCommentReportFilters = {},
) => {
  return kyInstance
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
}

/**
 * Get report by ID (admin)
 */
export const getBlogCommentReportByIdAPI = async (id: string) => {
  return kyInstance
    .get(`admin/blog-comment-report/${id}`)
    .json<IApiResponseWrapperType<IBlogCommentReportDataType>>()
}

/**
 * Update report status (admin)
 */
export const updateBlogCommentReportStatusAPI = async (
  id: string,
  data: IUpdateBlogCommentReportStatusPayload,
) => {
  return kyInstance
    .patch(`admin/blog-comment-report/${id}/status`, { json: data })
    .json<IApiResponseWrapperType<IBlogCommentReportDataType>>()
}

/**
 * Delete comment (admin)
 */
export const adminDeleteBlogCommentAPI = async (id: string) => {
  return kyInstance
    .delete(`admin/blog-comment-report/comment/${id}`)
    .json<IApiResponseWrapperType<{ message: string }>>()
}
