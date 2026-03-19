'use server';

import { publicKyInstance } from '@/lib/kyInstance/publicKy';
import type {
  IApiPaginationResponseWrapperType,
  IApiResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces';
import type {
  IReviewDataType,
  IReviewSummaryDataType,
  IReviewReplyDataType,
  IGetReviewsParams,
} from '@/lib/types/interfaces/apis/review.interfaces';
// import { cacheLife, cacheTag } from 'next/cache';
// import { DEFAULT_CACHE_TIME } from '@/constants/cache';

// Helper: build search params object, omitting undefined values
const buildSearchParams = (
  options: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean> =>
  Object.fromEntries(
    Object.entries(options).filter(([, v]) => v !== undefined),
  ) as Record<string, string | number | boolean>;

/**
 * Fetch public reviews for a product
 * Uses 'use cache' for optimal performance
 */
export const getPublicProductReviewsAPI = async (
  productId: string,
  options: Omit<IGetReviewsParams, 'productId'> = {},
) => {
  // 'use cache';
  // cacheLife(DEFAULT_CACHE_TIME);
  // cacheTag(`product-reviews-${productId}`);

  return publicKyInstance
    .get(`review/public/product/${productId}`, {
      searchParams: buildSearchParams({
        page: options.page ?? 1,
        limit: options.limit ?? 10,
        rating: options.rating,
        sortBy: options.sortBy,
        order: options.order,
      }),
    })
    .json<IApiPaginationResponseWrapperType<IReviewDataType>>();
};

/**
 * Fetch review summary for a product (average rating, distribution, etc.)
 * Uses 'use cache' for optimal performance
 */
export const getProductReviewSummaryAPI = async (productId: string) => {
  // 'use cache';
  // cacheLife(DEFAULT_CACHE_TIME);
  // cacheTag(`product-review-summary-${productId}`);

  return publicKyInstance
    .get(`review/public/product/${productId}/summary`)
    .json<IApiResponseWrapperType<IReviewSummaryDataType>>();
};

/**
 * Fetch a single public review by ID
 * Uses 'use cache' for optimal performance
 */
export const getPublicReviewByIdAPI = async (reviewId: string) => {
  // 'use cache';
  // cacheLife(DEFAULT_CACHE_TIME);
  // cacheTag(`review-${reviewId}`);

  return publicKyInstance
    .get(`review/public/${reviewId}`)
    .json<IApiResponseWrapperType<IReviewDataType>>();
};

/**
 * Fetch replies for a review
 * Uses 'use cache' for optimal performance
 */
export const getReviewRepliesAPI = async (reviewId: string) => {
  // 'use cache';
  // cacheLife(DEFAULT_CACHE_TIME);
  // cacheTag(`review-replies-${reviewId}`);

  return publicKyInstance
    .get(`review/${reviewId}/replies`)
    .json<IApiResponseWrapperType<IReviewReplyDataType[]>>();
};
