'use server';
import { DEFAULT_CACHE_TIME } from '@/constants/cache';
import { publicKyInstance } from '@/lib/kyInstance/publicKy';
import {
  IApiPaginationParams,
  IApiPaginationResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces';
import { IProductDataType } from '@/lib/types/interfaces/apis/product.interfaces';
import { cacheLife, cacheTag } from 'next/cache';

export const getProductsAPI = async (
  options: IApiPaginationParams = { page: 1, limit: 10 },
) => {
  'use cache';
  cacheLife(DEFAULT_CACHE_TIME);
  cacheTag('products');
  try {
    const data = await publicKyInstance
      .get('product', {
        searchParams: {
          page: options.page,
          limit: options.limit,
        },
      })
      .json<IApiPaginationResponseWrapperType<IProductDataType>>();
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
