'use server';
import { DEFAULT_CACHE_TIME } from '@/constants/cache';
import { publicKyInstance } from '@/lib/kyInstance/publicKy';
import { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import { ICategoryDataType } from '@/lib/types/interfaces/apis/header.interfaces';
import { cacheLife, cacheTag } from 'next/cache';

export const getCategoriesServerAPI = async () => {
  'use cache';
  cacheLife(DEFAULT_CACHE_TIME);
  cacheTag('categories');
  try {
    const response = await publicKyInstance
      .get('category')
      .json<IApiResponseWrapperType<ICategoryDataType[]>>();
    return response.data;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
};
