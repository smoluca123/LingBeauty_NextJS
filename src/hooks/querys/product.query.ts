import { getProductsAPI } from '@/lib/apis/server/product-apis';
import { useInfiniteQuery } from '@tanstack/react-query';

export const useGetProductsQuery = () => {
  return useInfiniteQuery({
    queryKey: ['products', 'top-products'],
    queryFn: ({ pageParam }) => getProductsAPI({ page: pageParam }),
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNextPage ? lastPage.data.currentPage + 1 : undefined,
    getPreviousPageParam: (firstPage) =>
      firstPage.data.hasPreviousPage
        ? firstPage.data.currentPage - 1
        : undefined,
    initialPageParam: 1,
  });
};
