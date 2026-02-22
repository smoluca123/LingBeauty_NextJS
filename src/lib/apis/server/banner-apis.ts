'use server';
import { DEFAULT_CACHE_TIME } from '@/constants/cache';
import { publicKyInstance } from '@/lib/kyInstance/publicKy';
import { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import { IBannerGroupDataType } from '@/lib/types/interfaces/apis/banner.interfaces';
import { cacheLife, cacheTag } from 'next/cache';

/**
 * Get active banner group for homepage
 * This is a server-side API call (no auth required)
 */
export const getActiveBannerGroupAPI = async () => {
  'use cache';
  cacheTag('banners');
  cacheLife(DEFAULT_CACHE_TIME);
  try {
    const data = await publicKyInstance
      .get('public/banners/active', {})
      .json<IApiResponseWrapperType<IBannerGroupDataType>>();
    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log('Error fetching active banner group:', error);
    if (error.response) {
      const errorData = await error.response.json();
      throw errorData.message;
    }
    throw error.message;
  }
};
