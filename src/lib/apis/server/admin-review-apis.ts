'use server';

import { kyInstance } from '@/lib/kyInstance/ky';
import type {
  IApiPaginationResponseWrapperType,
  IApiResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces';
import type {
  IReviewWithProductDataType,
  IReviewReplyDataType,
  IAdminReviewFilters,
  ICreateReviewReplyDataType,
} from '@/lib/types/interfaces/apis/review.interfaces';

// Type for paginated replies response
interface IReviewRepliesPaginationResponse {
  items: IReviewReplyDataType[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

// Helper: loại bỏ undefined trước khi truyền vào searchParams
const buildSearchParams = (
  options: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean> =>
  Object.fromEntries(
    Object.entries(options).filter(([, v]) => v !== undefined),
  ) as Record<string, string | number | boolean>;

// ============ Get All Reviews (Admin - yêu cầu auth JWT) ============
export const getAllAdminReviewsAPI = async (params: IAdminReviewFilters = {}) =>
  kyInstance
    .get('review', {
      searchParams: buildSearchParams({
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        productId: params.productId,
        userId: params.userId,
        rating: params.rating,
        isApproved: params.isApproved,
        sortBy: params.sortBy,
        order: params.order,
        search: params.search,
      }),
    })
    .json<IApiPaginationResponseWrapperType<IReviewWithProductDataType>>();

// ============ Get Pending Reviews (Admin) ============
export const getPendingReviewsAPI = async (
  params: Omit<IAdminReviewFilters, 'isApproved'> = {},
) =>
  kyInstance
    .get('review/admin/pending', {
      searchParams: buildSearchParams({
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        sortBy: params.sortBy,
        order: params.order,
      }),
    })
    .json<IApiPaginationResponseWrapperType<IReviewWithProductDataType>>();

// ============ Get Review by ID (Admin) ============
export const getAdminReviewByIdAPI = async (reviewId: string) =>
  kyInstance
    .get(`review/${reviewId}`)
    .json<IApiResponseWrapperType<IReviewWithProductDataType>>();

// ============ Approve/Reject Review (Admin) ============
export const approveReviewAPI = async (reviewId: string, isApproved: boolean) =>
  kyInstance
    .patch(`review/${reviewId}/approve`, {
      searchParams: { isApproved: String(isApproved) },
    })
    .json<IApiResponseWrapperType<IReviewWithProductDataType>>();

// ============ Delete Review (Admin) ============
export const deleteReviewAPI = async (reviewId: string) =>
  kyInstance
    .delete(`review/${reviewId}/admin`)
    .json<IApiResponseWrapperType<{ message: string }>>();

// ============ Admin Reply to Review ============
export const adminReplyToReviewAPI = async (
  reviewId: string,
  data: ICreateReviewReplyDataType,
) =>
  kyInstance
    .post(`review/${reviewId}/reply`, { json: data })
    .json<IApiResponseWrapperType<IReviewReplyDataType>>();

// ============ Get Review Replies ============
export const getReviewRepliesAPI = async (reviewId: string) =>
  kyInstance
    .get(`review/${reviewId}/replies`)
    .json<IApiResponseWrapperType<IReviewRepliesPaginationResponse>>();

// ============ Delete Reply (Admin) ============
export const deleteReplyAPI = async (replyId: string) =>
  kyInstance
    .delete(`review/reply/${replyId}`)
    .json<IApiResponseWrapperType<{ message: string }>>();
