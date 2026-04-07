import { getBrandsAPI } from '@/lib/apis/client/brand.apis'
import { IApiPaginationParams } from '@/lib/types/interfaces/apis/api.interfaces'
import { IBrandDataType } from '@/lib/types/interfaces/apis/header.interfaces'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

export const getBrandsListForSEOQueryKey = ['brands', 'list-for-seo']
export const useGetBrandsListForSEO = ({
  initialData,
}: {
  initialData?: IBrandDataType[]
}) => {
  const getBrands = async () => {
    try {
      const response = await getBrandsAPI()
      return response.data.items
    } catch (error) {
      throw new Error(error as string)
    }
  }

  return useQuery({
    queryKey: getBrandsListForSEOQueryKey,
    queryFn: getBrands,
    initialData,
  })
}

export const getBrandsQueryKey = ['brands']
export const useGetBrandsQuery = (options?: {
  limit: IApiPaginationParams['limit']
}) => {
  const getBrands = async (params: IApiPaginationParams) => {
    try {
      const response = await getBrandsAPI(params)
      return response
    } catch (error) {
      throw new Error(error as string)
    }
  }

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
  })
}
