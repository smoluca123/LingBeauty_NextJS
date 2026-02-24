import {
  getFilterCategoriesAPI,
  getProductListingAPI,
  IFilterCategoriesParams,
  IProductListingParams,
} from '@/lib/apis/client/product.apis';
import { IApiPaginationResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import { IProductDataType } from '@/lib/types/interfaces/apis/product.interfaces';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

export const getProductListingQueryKey = (params: IProductListingParams) => [
  'product-listing',
  params,
];

/**
 * React Query hook for product listing with server-side filtering, sorting, and pagination.
 * Uses keepPreviousData to prevent layout shifts during page/filter changes.
 * Accepts optional initialData for hybrid SSR — server pre-fetches page 1 data.
 */
export const useProductListingQuery = (
  params: IProductListingParams,
  initialData?: IApiPaginationResponseWrapperType<IProductDataType>,
) => {
  return useQuery({
    queryKey: getProductListingQueryKey(params),
    queryFn: () => getProductListingAPI(params),
    placeholderData: keepPreviousData,
    initialData,
  });
};

/**
 * React Query hook for fetching filter categories.
 * Returns distinct categories with product counts based on context params.
 */
export const useFilterCategoriesQuery = (params: IFilterCategoriesParams) => {
  return useQuery({
    queryKey: ['filter-categories', params],
    queryFn: () => getFilterCategoriesAPI(params),
    placeholderData: keepPreviousData,
  });
};
