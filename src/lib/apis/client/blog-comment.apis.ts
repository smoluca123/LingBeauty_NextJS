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
  ICreateBlogCommentReportPayload,
  IBlogCommentReportDataType,
} from '@/lib/types/interfaces/apis/blog-comment.interfaces'

// Helper: loại bỏ undefined trước khi truyền vào searchParams
const buildSearchParams = (
  options: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean> =>
  Object.fromEntries(
    Object.entries(options).filter(([, v]) => v !== undefined),
  ) as Record<string, string | number | boolean>

/**
 * Get all comments
 * @param params - Comment filter parameters
 * @returns Promise with paginated comment data
 * @throws Error with backend message
 */
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

/**
 * Get comment by ID
 * @param id - Comment ID
 * @returns Promise with comment data
 * @throws Error with backend message
 */
export const getBlogCommentByIdClientAPI = async (id: string) => {
  try {
    return await kyNextInstance
      .get(`blog-comment/${id}`)
      .json<IApiResponseWrapperType<IBlogCommentDataType>>()
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Failed to fetch comment'))
  }
}

/**
 * Create comment
 * @param data - Comment creation payload
 * @returns Promise with created comment data
 * @throws Error with backend message
 */
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

/**
 * Update comment
 * @param id - Comment ID
 * @param data - Comment update payload
 * @returns Promise with updated comment data
 * @throws Error with backend message
 */
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

/**
 * Delete comment
 * @param id - Comment ID
 * @returns Promise with success message
 * @throws Error with backend message
 */
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

/**
 * Create comment report
 * @param data - Report creation payload
 * @returns Promise with created report data
 * @throws Error with backend message
 */
export const createBlogCommentReportClientAPI = async (
  data: ICreateBlogCommentReportPayload,
) => {
  try {
    return await kyNextInstance
      .post('blog-comment-report', { json: data })
      .json<IApiResponseWrapperType<IBlogCommentReportDataType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to report comment'),
    )
  }
}
