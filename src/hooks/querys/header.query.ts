import { GC_TIME, STALE_TIME } from '@/constants/cache';
import { getCategoriesAPI } from '@/lib/apis/client/header-apis';
import { useQuery } from '@tanstack/react-query';

export const getCategoriesQueryKey = 'categories';
export function useCategoriesQuery() {
  const getCategories = async () => {
    try {
      const response = await getCategoriesAPI();
      return response.data;
    } catch (error) {
      throw new Error(error as string);
    }
  };
  const query = useQuery({
    queryKey: [getCategoriesQueryKey],
    queryFn: () => getCategories(),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });

  return query;
}
