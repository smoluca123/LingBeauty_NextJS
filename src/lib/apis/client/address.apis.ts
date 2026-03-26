import { kyNextInstance } from '@/lib/kyInstance/kyNext'
import { IAddressDataType } from '@/lib/types/interfaces/apis/address.interfaces'
import {
  IApiPaginationParams,
  IApiPaginationResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces'
import { extractErrorMessage } from '@/lib/utils/error-handler'

/**
 * Fetch current user's addresses with pagination
 * @param params - Pagination and search parameters
 * @returns Promise with paginated address data
 * @throws Error with backend message
 */
export const getMyAddressesAPI = async (
  params?: IApiPaginationParams & {
    search?: string
  },
) => {
  try {
    const response = await kyNextInstance
      .get('me/address', {
        searchParams: {
          limit: params?.limit,
          page: params?.page,
          search: params?.search,
        },
      })
      .json<IApiPaginationResponseWrapperType<IAddressDataType>>()
    return response
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to fetch addresses'),
    )
  }
}
