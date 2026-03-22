import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
  getPublicProductQuestionsAPI,
  getMyQuestionsAPI,
} from '@/lib/apis/client/product-question.apis';
import { IProductQuestionFilters } from '@/lib/types/interfaces/apis/product-question.interfaces';

// Query Keys
export const getProductQuestionsQueryKey = (
  productId: string,
  params?: Omit<IProductQuestionFilters, 'productId'>,
) => ['product-questions', productId, params];

export const getMyQuestionsQueryKey = (
  params?: IProductQuestionFilters,
) => ['my-questions', params];

/**
 * React Query hook to fetch public product questions client-side.
 * Used in the Q&A tab on the product detail page.
 */
export const useGetPublicProductQuestionsQuery = (
  productId: string,
  params?: Omit<IProductQuestionFilters, 'productId'>,
) => {
  // Set defaults and filter out undefined values
  const queryParams: Omit<IProductQuestionFilters, 'productId'> = {};
  if (params?.page) queryParams.page = params.page;
  if (params?.limit) queryParams.limit = params.limit;
  if (params?.status) queryParams.status = params.status;
  if (params?.sortBy) queryParams.sortBy = params.sortBy;
  if (params?.order) queryParams.order = params.order;

  return useQuery({
    queryKey: getProductQuestionsQueryKey(productId, queryParams),
    queryFn: () => getPublicProductQuestionsAPI(productId, queryParams),
    placeholderData: keepPreviousData,
    enabled: !!productId,
  });
};

/**
 * React Query hook to fetch user's own questions
 */
export const useGetMyQuestionsQuery = (
  params?: IProductQuestionFilters,
) => {
  // Set defaults and filter out undefined values
  const queryParams: IProductQuestionFilters = {};
  if (params?.page) queryParams.page = params.page;
  if (params?.limit) queryParams.limit = params.limit;
  if (params?.status) queryParams.status = params.status;
  if (params?.sortBy) queryParams.sortBy = params.sortBy;
  if (params?.order) queryParams.order = params.order;

  return useQuery({
    queryKey: getMyQuestionsQueryKey(queryParams),
    queryFn: () => getMyQuestionsAPI(queryParams),
    placeholderData: keepPreviousData,
  });
};
