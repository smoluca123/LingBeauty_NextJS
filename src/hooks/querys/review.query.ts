import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getProductReviewsAPI } from '@/lib/apis/client/product.apis';
import { IGetReviewsParams } from '@/lib/types/interfaces/apis/review.interfaces';

export const getProductReviewsQueryKey = (params: IGetReviewsParams) => [
  'reviews',
  params,
];

/**
 * React Query hook to fetch product reviews client-side.
 * Typically used in the Reviews tab on the product detail page.
 */
export const useGetProductReviewsQuery = (params: IGetReviewsParams) => {
  return useQuery({
    queryKey: getProductReviewsQueryKey(params),
    queryFn: () => getProductReviewsAPI(params),
    placeholderData: keepPreviousData,
    enabled: !!params.productId,
  });
};
