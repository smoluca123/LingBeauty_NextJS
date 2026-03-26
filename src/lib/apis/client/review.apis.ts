import { kyNextInstance } from '@/lib/kyInstance/kyNext'
import type {
  IApiPaginationResponseWrapperType,
  IApiResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces'
import type {
  IReviewDataType,
  IReviewSummaryDataType,
  IReviewReplyDataType,
  IGetReviewsParams,
  ICreateReviewDataType,
  ICreateReviewReplyDataType,
  IUpdateReviewDataType,
  IUpdateReviewReplyDataType,
  IGetReviewRepliesParams,
} from '@/lib/types/interfaces/apis/review.interfaces'
import { extractErrorMessage } from '@/lib/utils/error-handler'

/**
 * Fetch public reviews for a product (client-side)
 * Calls Next.js API route -> Backend API
 */
export const getPublicProductReviewsAPI = async (
  productId: string,
  params: Omit<IGetReviewsParams, 'productId'> = {},
) => {
  try {
    const searchParams: Record<string, string | number> = {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
    }
    if (params.rating) searchParams.rating = params.rating
    if (params.sortBy) searchParams.sortBy = params.sortBy
    if (params.order) searchParams.order = params.order

    const response = await kyNextInstance
      .get(`review/public/product/${productId}`, { searchParams })
      .json<IApiPaginationResponseWrapperType<IReviewDataType>>()
    return response
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Failed to fetch reviews'))
  }
}

/**
 * Fetch review summary for a product (client-side)
 * Calls Next.js API route -> Backend API
 */
export const getProductReviewSummaryAPI = async (productId: string) => {
  try {
    const response = await kyNextInstance
      .get(`review/public/product/${productId}/summary`)
      .json<IApiResponseWrapperType<IReviewSummaryDataType>>()
    return response
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to fetch review summary'),
    )
  }
}

/**
 * Fetch a single public review by ID (client-side)
 * Calls Next.js API route -> Backend API
 */
export const getPublicReviewByIdAPI = async (reviewId: string) => {
  try {
    const response = await kyNextInstance
      .get(`review/public/${reviewId}`)
      .json<IApiResponseWrapperType<IReviewDataType>>()
    return response
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Failed to fetch review'))
  }
}

/**
 * Create a new review
 * Calls Next.js API route (/api/review) which uses server action
 */
export const createReviewAPI = async (data: ICreateReviewDataType) => {
  try {
    const response = await kyNextInstance
      .post('review', { json: data })
      .json<IApiResponseWrapperType<IReviewDataType>>()
    return response
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Failed to create review'))
  }
}

/**
 * Mark a review as helpful
 * Calls Next.js API route (/api/review/:reviewId/helpful) which uses server action
 */
export const markHelpfulAPI = async (reviewId: string) => {
  try {
    const response = await kyNextInstance
      .post(`review/${reviewId}/helpful`)
      .json<
        IApiResponseWrapperType<{
          reviewId: string
          helpfulCount: number
          hasMarked: boolean
          isHelpful: boolean
        }>
      >()
    return response
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Failed to mark helpful'))
  }
}

/**
 * Unmark helpful from a review
 * Calls Next.js API route (/api/review/:reviewId/helpful) which uses server action
 */
export const unmarkHelpfulAPI = async (reviewId: string) => {
  try {
    const response = await kyNextInstance
      .delete(`review/${reviewId}/helpful`)
      .json<
        IApiResponseWrapperType<{
          reviewId: string
          helpfulCount: number
          hasMarked: boolean
          isHelpful: boolean | null
        }>
      >()
    return response
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to unmark helpful'),
    )
  }
}

/**
 * Create a reply to a review
 * Calls Next.js API route (/api/review/:reviewId/reply) which uses server action
 */
export const createReviewReplyAPI = async (
  reviewId: string,
  data: ICreateReviewReplyDataType,
) => {
  try {
    const response = await kyNextInstance
      .post(`review/${reviewId}/reply`, { json: data })
      .json<IApiResponseWrapperType<IReviewReplyDataType>>()
    return response
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Failed to create reply'))
  }
}

/**
 * Fetch replies for a review
 * Calls Next.js API route -> Backend API
 */
export const getReviewRepliesAPI = async (
  reviewId: string,
  params: IGetReviewRepliesParams = {},
) => {
  try {
    const searchParams: Record<string, string | number> = {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
    }
    if (params.sortBy) searchParams.sortBy = params.sortBy
    if (params.order) searchParams.order = params.order

    const response = await kyNextInstance
      .get(`review/${reviewId}/replies`, { searchParams })
      .json<IApiPaginationResponseWrapperType<IReviewReplyDataType>>()
    return response
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Failed to fetch replies'))
  }
}

/**
 * Update a review
 * Calls Next.js API route (/api/review/:reviewId) which uses server action
 */
export const updateReviewAPI = async (
  reviewId: string,
  data: IUpdateReviewDataType,
) => {
  try {
    const response = await kyNextInstance
      .patch(`review/${reviewId}`, { json: data })
      .json<IApiResponseWrapperType<IReviewDataType>>()
    return response
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Failed to update review'))
  }
}

/**
 * Delete a review
 * Calls Next.js API route (/api/review/:reviewId) which uses server action
 */
export const deleteReviewAPI = async (reviewId: string) => {
  try {
    const response = await kyNextInstance
      .delete(`review/${reviewId}`)
      .json<IApiResponseWrapperType<{ deleted: boolean }>>()
    return response
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Failed to delete review'))
  }
}

/**
 * Update a review reply
 * Calls Next.js API route (/api/review/reply/:replyId) which uses server action
 */
export const updateReviewReplyAPI = async (
  replyId: string,
  data: IUpdateReviewReplyDataType,
) => {
  try {
    const response = await kyNextInstance
      .patch(`review/reply/${replyId}`, { json: data })
      .json<IApiResponseWrapperType<IReviewReplyDataType>>()
    return response
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Failed to update reply'))
  }
}

/**
 * Delete a review reply
 * Calls Next.js API route (/api/review/reply/:replyId) which uses server action
 */
export const deleteReviewReplyAPI = async (replyId: string) => {
  try {
    const response = await kyNextInstance
      .delete(`review/reply/${replyId}`)
      .json<IApiResponseWrapperType<{ deleted: boolean }>>()
    return response
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Failed to delete reply'))
  }
}
