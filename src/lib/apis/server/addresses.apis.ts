import { DEFAULT_LIMIT, DEFAULT_PAGE } from '@/constants/api';
import { kyInstance } from '@/lib/kyInstance/ky';
import { IAddressDataType } from '@/lib/types/interfaces/apis/address.interfaces';
import {
  IApiPaginationParams,
  IApiPaginationResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces';
import { HTTPError } from 'ky';

export const getMyAddressesAPI = async ({
  limit = DEFAULT_LIMIT,
  page = DEFAULT_PAGE,
  search,
}: IApiPaginationParams & { search?: string }): Promise<
  IApiPaginationResponseWrapperType<IAddressDataType>
> => {
  try {
    console.log('limit', limit);
    console.log('page', page);
    console.log('search', search);
    const response = await kyInstance
      .get('user/address', {
        searchParams: {
          limit,
          page,
          search,
        },
      })
      .json<IApiPaginationResponseWrapperType<IAddressDataType>>();
    return response;
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to fetch addresses');
    }
    throw error;
  }
};
