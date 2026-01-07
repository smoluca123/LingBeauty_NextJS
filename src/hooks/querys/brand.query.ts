import { getBrandsAPI } from '@/lib/apis/server/brand-apis';
import { IApiPaginationParams } from '@/lib/types/interfaces/apis/api.interfaces';
import { useInfiniteQuery } from '@tanstack/react-query';

export const getBrandsQueryKey = ['brands'];
export const useGetBrandsQuery = (options?: {
  limit: IApiPaginationParams['limit'];
}) => {
  const getBrands = async (params: IApiPaginationParams) => {
    try {
      const response = await getBrandsAPI(params);
      console.log(response);
      return response;
    } catch (error) {
      throw new Error(error as string);
    }
  };

  return useInfiniteQuery({
    queryKey: getBrandsQueryKey,
    queryFn: ({ pageParam }) =>
      getBrands({ page: pageParam, limit: options?.limit }),
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNextPage ? lastPage.data.currentPage + 1 : undefined,
    getPreviousPageParam: (firstPage) =>
      firstPage.data.hasPreviousPage
        ? firstPage.data.currentPage - 1
        : undefined,
    initialPageParam: 1,
  });
};
