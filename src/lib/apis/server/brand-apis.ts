'use server';

import { publicKyInstance } from '@/lib/kyInstance/publicKy';
import {
  IApiPaginationParams,
  IApiPaginationResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces';
import { IBrandDataType } from '@/lib/types/interfaces/apis/header.interfaces';
import { cacheLife, cacheTag } from 'next/cache';

export const getBrandsAPI = async (
  options: IApiPaginationParams = { page: 1, limit: 10 },
) => {
  'use cache';
  cacheLife('hours');
  cacheTag('brands');
  try {
    const data = await publicKyInstance
      .get('brand', {
        searchParams: {
          page: options.page,
          limit: options.limit,
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
