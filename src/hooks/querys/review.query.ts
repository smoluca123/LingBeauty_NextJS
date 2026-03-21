import { useQuery, useInfiniteQuery, keepPreviousData } from '@tanstack/react-query';
import {
  getPublicProductReviewsAPI,
  getProductReviewSummaryAPI,
  getPublicReviewByIdAPI,
  getReviewRepliesAPI,
} from '@/lib/apis/client/review.apis';
import { IGetReviewsParams, IGetReviewRepliesParams } from '@/lib/types/interfaces/apis/review.interfaces';

// Query Keys
export const getProductReviewsQueryKey = (
  productId: string,
  params?: Omit<IGetReviewsParams, 'productId'>,
) => ['reviews', productId, params];

export const getProductReviewSummaryQueryKey = (productId: string) => [
  'review-summary',
  productId,
];

export const getPublicReviewByIdQueryKey = (reviewId: string) => [
  'review',
  reviewId,
];

export const getReviewRepliesQueryKey = (reviewId: string) => [
  'review-replies',
  reviewId,
];

/**
 * React Query hook to fetch public product reviews client-side.
 * Typically used in the Reviews tab on the product detail page.
 */
export const useGetPublicProductReviewsQuery = (
  productId: string,
  params?: Omit<IGetReviewsParams, 'productId'>,
) => {
  return useQuery({
    queryKey: getProductReviewsQueryKey(productId, params),
    queryFn: () => getPublicProductReviewsAPI(productId, params),
    placeholderData: keepPreviousData,
    enabled: !!productId,
  });
};

/**
 * React Query hook to fetch product review summary (average rating, distribution, etc.)
 */
export const useGetProductReviewSummaryQuery = (productId: string) => {
  return useQuery({
    queryKey: getProductReviewSummaryQueryKey(productId),
    queryFn: () => getProductReviewSummaryAPI(productId),
    enabled: !!productId,
  });
};

/**
 * React Query hook to fetch a single public review by ID
 */
export const useGetPublicReviewByIdQuery = (reviewId: string) => {
  return useQuery({
    queryKey: getPublicReviewByIdQueryKey(reviewId),
    queryFn: () => getPublicReviewByIdAPI(reviewId),
    enabled: !!reviewId,
  });
};

/**
 * React Query hook to fetch infinite replies for a review
 */
export const useGetReviewRepliesInfiniteQuery = (
  reviewId: string,
  params?: Omit<IGetReviewRepliesParams, 'page'>,
) => {
  return useInfiniteQuery({
    queryKey: getReviewRepliesQueryKey(reviewId),
    queryFn: ({ pageParam = 1 }) =>
      getReviewRepliesAPI(reviewId, { ...params, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.data) return undefined;
      const { currentPage, pageSize, totalCount } = lastPage.data;
      const hasMore = currentPage * pageSize < totalCount;
      return hasMore ? currentPage + 1 : undefined;
    },
    enabled: !!reviewId,
  });
};
