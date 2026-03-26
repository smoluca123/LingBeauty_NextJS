'use server'

import { kyInstance } from '@/lib/kyInstance/ky'
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces'
import type {
  IReviewDataType,
  IReviewReplyDataType,
  ICreateReviewDataType,
  ICreateReviewReplyDataType,
  IUpdateReviewDataType,
  IUpdateReviewReplyDataType,
} from '@/lib/types/interfaces/apis/review.interfaces'

// Let HTTPError bubble up naturally — proxyRoute in route handlers handles forwarding.

/**
 * Create a new review
 * @param payload - Review data to create
 * @returns Created review data
 * @throws Error with backend message if request fails
 */
export const createReviewAction = async (payload: ICreateReviewDataType) =>
  kyInstance
    .post('review', { json: payload })
    .json<IApiResponseWrapperType<IReviewDataType>>()

/**
 * Mark a review as helpful
 * @param reviewId - Review ID to mark as helpful
 * @returns Updated helpful count and status
 * @throws Error with backend message if request fails
 */
export const markHelpfulAction = async (reviewId: string) =>
  kyInstance.post(`review/${reviewId}/helpful`).json<
    IApiResponseWrapperType<{
      reviewId: string
      helpfulCount: number
      hasMarked: boolean
      isHelpful: boolean
    }>
  >()

/**
 * Unmark helpful from a review
 * @param reviewId - Review ID to unmark
 * @returns Updated helpful count and status
 * @throws Error with backend message if request fails
 */
export const unmarkHelpfulAction = async (reviewId: string) =>
  kyInstance.delete(`review/${reviewId}/helpful`).json<
    IApiResponseWrapperType<{
      reviewId: string
      helpfulCount: number
      hasMarked: boolean
      isHelpful: boolean | null
    }>
  >()

/**
 * Create a reply to a review
 * @param reviewId - Review ID to reply to
 * @param payload - Reply data
 * @returns Created reply data
 * @throws Error with backend message if request fails
 */
export const createReviewReplyAction = async (
  reviewId: string,
  payload: ICreateReviewReplyDataType,
) =>
  kyInstance
    .post(`review/${reviewId}/reply`, { json: payload })
    .json<IApiResponseWrapperType<IReviewReplyDataType>>()

/**
 * Update a review
 * @param reviewId - Review ID to update
 * @param payload - Updated review data
 * @returns Updated review data
 * @throws Error with backend message if request fails
 */
export const updateReviewAction = async (
  reviewId: string,
  payload: IUpdateReviewDataType,
) =>
  kyInstance
    .patch(`review/${reviewId}`, { json: payload })
    .json<IApiResponseWrapperType<IReviewDataType>>()

/**
 * Delete a review
 * @param reviewId - Review ID to delete
 * @returns Deletion status
 * @throws Error with backend message if request fails
 */
export const deleteReviewAction = async (reviewId: string) =>
  kyInstance
    .delete(`review/${reviewId}`)
    .json<IApiResponseWrapperType<{ deleted: boolean }>>()

/**
 * Update a reply
 * @param replyId - Reply ID to update
 * @param payload - Updated reply data
 * @returns Updated reply data
 * @throws Error with backend message if request fails
 */
export const updateReviewReplyAction = async (
  replyId: string,
  payload: IUpdateReviewReplyDataType,
) =>
  kyInstance
    .patch(`review/reply/${replyId}`, { json: payload })
    .json<IApiResponseWrapperType<IReviewReplyDataType>>()

/**
 * Delete a reply
 * @param replyId - Reply ID to delete
 * @returns Deletion status
 * @throws Error with backend message if request fails
 */
export const deleteReviewReplyAction = async (replyId: string) =>
  kyInstance
    .delete(`review/reply/${replyId}`)
    .json<IApiResponseWrapperType<{ deleted: boolean }>>()
