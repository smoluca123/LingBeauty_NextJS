'use server';

import { kyInstance } from '@/lib/kyInstance/ky';
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import type {
  IReviewDataType,
  IReviewReplyDataType,
  ICreateReviewDataType,
  ICreateReviewReplyDataType,
  IUpdateReviewDataType,
  IUpdateReviewReplyDataType,
} from '@/lib/types/interfaces/apis/review.interfaces';

// Let HTTPError bubble up naturally — proxyRoute in route handlers handles forwarding.

/** POST /review — create a new review */
export const createReviewAction = async (payload: ICreateReviewDataType) =>
  kyInstance
    .post('review', { json: payload })
    .json<IApiResponseWrapperType<IReviewDataType>>();

/** POST /review/:id/helpful — mark a review as helpful */
export const markHelpfulAction = async (reviewId: string) =>
  kyInstance.post(`review/${reviewId}/helpful`).json<
    IApiResponseWrapperType<{
      reviewId: string;
      helpfulCount: number;
      hasMarked: boolean;
      isHelpful: boolean;
    }>
  >();

/** DELETE /review/:id/helpful — unmark helpful from a review */
export const unmarkHelpfulAction = async (reviewId: string) =>
  kyInstance.delete(`review/${reviewId}/helpful`).json<
    IApiResponseWrapperType<{
      reviewId: string;
      helpfulCount: number;
      hasMarked: boolean;
      isHelpful: boolean | null;
    }>
  >();

/** POST /review/:id/reply — create a reply to a review */
export const createReviewReplyAction = async (
  reviewId: string,
  payload: ICreateReviewReplyDataType,
) =>
  kyInstance
    .post(`review/${reviewId}/reply`, { json: payload })
    .json<IApiResponseWrapperType<IReviewReplyDataType>>();

/** PATCH /review/:id — update a review */
export const updateReviewAction = async (
  reviewId: string,
  payload: IUpdateReviewDataType,
) =>
  kyInstance
    .patch(`review/${reviewId}`, { json: payload })
    .json<IApiResponseWrapperType<IReviewDataType>>();

/** DELETE /review/:id — delete a review */
export const deleteReviewAction = async (reviewId: string) =>
  kyInstance
    .delete(`review/${reviewId}`)
    .json<IApiResponseWrapperType<{ deleted: boolean }>>();

/** PATCH /review/reply/:id — update a reply */
export const updateReviewReplyAction = async (
  replyId: string,
  payload: IUpdateReviewReplyDataType,
) =>
  kyInstance
    .patch(`review/reply/${replyId}`, { json: payload })
    .json<IApiResponseWrapperType<IReviewReplyDataType>>();

/** DELETE /review/reply/:id — delete a reply */
export const deleteReviewReplyAction = async (replyId: string) =>
  kyInstance
    .delete(`review/reply/${replyId}`)
    .json<IApiResponseWrapperType<{ deleted: boolean }>>();
