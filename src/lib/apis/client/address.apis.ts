import { kyNextInstance } from '@/lib/kyInstance/kyNext';
import { IAddressDataType } from '@/lib/types/interfaces/apis/address.interfaces';
import {
  IApiPaginationParams,
  IApiPaginationResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces';
import { HTTPError } from 'ky';

export const getMyAddressesAPI = async (
  params?: IApiPaginationParams & {
    search?: string;
  },
) => {
  try {
    //   const response = await getMyAddressesAPI(params || {});
    const response = await kyNextInstance
      .get('me/address', {
        searchParams: {
          limit: params?.limit,
          page: params?.page,
          search: params?.search,
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
