import { kyClientInstance } from '@/lib/kyInstance/kyClient';
import {
  IApiPaginationParams,
  IApiPaginationResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces';
import { IBrandDataType } from '@/lib/types/interfaces/apis/header.interfaces';
import { HTTPError } from 'ky';

export const getBrandsAPI = async (params?: IApiPaginationParams) => {
  try {
    const response = await kyClientInstance
      .get('brand', {
        searchParams: {
          limit: params?.limit,
          page: params?.page,
        },
      })
      .json<IApiPaginationResponseWrapperType<IBrandDataType>>();
    return response;
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to fetch addresses');
    }
    throw error;
  }
};
