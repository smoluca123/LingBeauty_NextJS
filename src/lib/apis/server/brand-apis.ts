'use server';

import { DEFAULT_CACHE_TIME } from '@/constants/cache';
import { publicKyInstance } from '@/lib/kyInstance/publicKy';
import type {
  IApiPaginationParams,
  IApiPaginationResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces';
import type { IBrandDataType } from '@/lib/types/interfaces/apis/header.interfaces';
import { cacheLife, cacheTag } from 'next/cache';

export const getBrandsAPI = async (
  options: IApiPaginationParams = { page: 1, limit: 10 },
) => {
  'use cache';
  cacheLife(DEFAULT_CACHE_TIME);
  cacheTag('brands');
  return publicKyInstance
    .get('brand', {
      searchParams: { page: options.page, limit: options.limit },
    })
    .json<IApiPaginationResponseWrapperType<IBrandDataType>>();
};
