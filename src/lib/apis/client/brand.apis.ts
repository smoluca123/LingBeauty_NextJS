import { kyNextInstance } from '@/lib/kyInstance/kyNext'
import {
  IApiPaginationParams,
  IApiPaginationResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces'
import { IBrandDataType } from '@/lib/types/interfaces/apis/header.interfaces'
import { extractErrorMessage } from '@/lib/utils/error-handler'

/**
 * Fetch brands with pagination
 * @param params - Pagination parameters
 * @returns Promise with paginated brand data
 * @throws Error with backend message
 */
export const getBrandsAPI = async (params?: IApiPaginationParams) => {
  try {
    const response = await kyNextInstance
      .get('brand', {
        searchParams: {
          limit: params?.limit,
          page: params?.page,
        },
      })
      .json<IApiPaginationResponseWrapperType<IBrandDataType>>()
    return response
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Failed to fetch brands'))
  }
}
