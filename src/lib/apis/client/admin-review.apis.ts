import { kyNextInstance } from '@/lib/kyInstance/kyNext';
import { HTTPError } from 'ky';
import type {
  IApiPaginationResponseWrapperType,
  IApiResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces';
import type {
  IReviewWithProductDataType,
  IReviewReplyDataType,
  IAdminReviewFilters,
  IAdminReviewStatsDataType,
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

const handleError = async (error: unknown) => {
  if (error instanceof HTTPError) {
    const data = await error.response.json().catch(() => ({}));
    throw new Error((data as { message?: string }).message || error.message);
  }
  throw error;
};

// ============ Get All Reviews (Admin) ============
export const getAllAdminReviewsClientAPI = async (
  params: IAdminReviewFilters = {},
) => {
  try {
    return await kyNextInstance
      .get('admin/reviews', {
        searchParams: buildSearchParams({
          page: params.page,
          limit: params.limit,
          productId: params.productId,
          userId: params.userId,
          rating: params.rating,
          isApproved: params.isApproved,
          sortBy: params.sortBy,
          order: params.order,
          search: params.search,
          startDate: params.startDate,
          endDate: params.endDate,
        }),
      })
      .json<IApiPaginationResponseWrapperType<IReviewWithProductDataType>>();
  } catch (error) {
    return handleError(error);
  }
};

// ============ Get Pending Reviews (Admin) ============
export const getPendingReviewsClientAPI = async (
  params: Omit<IAdminReviewFilters, 'isApproved'> = {},
) => {
  try {
    return await kyNextInstance
      .get('admin/reviews/pending', {
        searchParams: buildSearchParams({
          page: params.page,
          limit: params.limit,
          sortBy: params.sortBy,
          order: params.order,
        }),
      })
      .json<IApiPaginationResponseWrapperType<IReviewWithProductDataType>>();
  } catch (error) {
    return handleError(error);
  }
};

// ============ Get Review by ID (Admin) ============
export const getAdminReviewByIdClientAPI = async (reviewId: string) => {
  try {
    return await kyNextInstance
      .get(`admin/reviews/${reviewId}`)
      .json<IApiResponseWrapperType<IReviewWithProductDataType>>();
  } catch (error) {
    return handleError(error);
  }
};

// ============ Approve/Reject Review (Admin) ============
export const approveReviewClientAPI = async (
  reviewId: string,
  isApproved: boolean,
) => {
  try {
    return await kyNextInstance
      .patch(`admin/reviews/${reviewId}/approve`, {
        searchParams: { isApproved: String(isApproved) },
      })
      .json<IApiResponseWrapperType<IReviewWithProductDataType>>();
  } catch (error) {
    return handleError(error);
  }
};

// ============ Delete Review (Admin) ============
export const deleteReviewClientAPI = async (reviewId: string) => {
  try {
    return await kyNextInstance
      .delete(`review/${reviewId}/admin`)
      .json<IApiResponseWrapperType<{ message: string }>>();
  } catch (error) {
    return handleError(error);
  }
};

// ============ Admin Reply to Review ============
export const adminReplyToReviewClientAPI = async (
  reviewId: string,
  data: ICreateReviewReplyDataType,
) => {
  try {
    return await kyNextInstance
      .post(`admin/reviews/${reviewId}/reply`, { json: data })
      .json<IApiResponseWrapperType<IReviewReplyDataType>>();
  } catch (error) {
    return handleError(error);
  }
};

// ============ Get Review Replies ============
export const getReviewRepliesClientAPI = async (
  reviewId: string,
  page: number = 1,
  limit: number = 10,
) => {
  try {
    return await kyNextInstance
      .get(`admin/reviews/${reviewId}/replies`, {
        searchParams: buildSearchParams({
          page,
          limit,
        }),
      })
      .json<IApiResponseWrapperType<IReviewRepliesPaginationResponse>>();
  } catch (error) {
    return handleError(error);
  }
};

// ============ Delete Reply (Admin) ============
export const deleteReplyClientAPI = async (replyId: string) => {
  try {
    return await kyNextInstance
      .delete(`admin/reviews/reply/${replyId}`)
      .json<IApiResponseWrapperType<{ message: string }>>();
  } catch (error) {
    return handleError(error);
  }
};

// ============ Get Review Statistics (Admin) ============
export const getAdminReviewStatsClientAPI = async (
  params: { startDate?: string; endDate?: string } = {},
) => {
  try {
    return await kyNextInstance
      .get('admin/reviews/stats', {
        searchParams: buildSearchParams({
          startDate: params.startDate,
          endDate: params.endDate,
        }),
      })
      .json<IApiResponseWrapperType<IAdminReviewStatsDataType>>();
  } catch (error) {
    return handleError(error);
  }
};
