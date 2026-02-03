'use server';

import { kyInstance } from '@/lib/kyInstance/ky';
import {
  IApiPaginationParams,
  IApiPaginationResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces';
import { IBrandDataType } from '@/lib/types/interfaces/apis/header.interfaces';

export const getBrandsAPI = async (
  options: IApiPaginationParams = { page: 1, limit: 10 },
) => {
  try {
    const data = await kyInstance
      .get('brand', {
        searchParams: {
          page: options.page,
          limit: options.limit,
        },
        next: {
          revalidate: 300,
        },
      })
      .json<IApiPaginationResponseWrapperType<IBrandDataType>>();
    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    if (error.response) {
      const errorData = await error.response.json();
      throw errorData.message;
    }
    throw error.message;
  }
};
